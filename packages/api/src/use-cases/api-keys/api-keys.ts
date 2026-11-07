import {
  API_KEY_RATE_LIMIT_PER_MINUTE,
  MAX_ACTIVE_API_KEYS,
} from "@tech-companies-portugal/core";
import {
  generateApiKey,
  hashApiKey,
  isApiKeyFormat,
} from "@tech-companies-portugal/security";
import type {
  ApiKeyPrincipal,
  ApiKeysRepository,
} from "../../services/api-keys/types";
import type { CacheService } from "../../services/cache/types";
import type { RateLimitService } from "../../services/ratelimit/types";
import { ConflictError, NotFoundError } from "../errors";
import type { ApiKeysUseCases } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const AUTH_CACHE_SECONDS = 60; // 60 seconds to remember a hit
const AUTH_MISS_CACHE_SECONDS = 30; // 30 seconds to remember a miss
const MISS = "miss"; // Marker for cache misses

const authCacheKey = (keyHash: string) => `tcp:api-key:${keyHash}`;

export const createApiKeysUseCases = ({
  cacheService,
  rateLimitService,
  apiKeysRepository,
}: {
  cacheService: CacheService;
  rateLimitService: RateLimitService;
  apiKeysRepository: ApiKeysRepository;
}): ApiKeysUseCases => {
  const cacheMiss = async (keyHash: string) => {
    try {
      await cacheService.set(
        authCacheKey(keyHash),
        MISS,
        AUTH_MISS_CACHE_SECONDS,
      );
    } catch (error) {
      console.warn("Unable to cache API key miss", error);
    }
  };

  /**
   * Replaces each key's cached principal with a miss so revocation applies
   * immediately. A marker, not a delete: lookups cache with `nx`, so one
   * already in flight can't write the revoked key back.
   */
  const invalidate = async (...keyHashes: string[]) => {
    if (keyHashes.length === 0) return;

    try {
      await Promise.all(
        keyHashes.map((keyHash) =>
          cacheService.set(authCacheKey(keyHash), MISS, AUTH_CACHE_SECONDS),
        ),
      );
    } catch (error) {
      // The entry still expires within AUTH_CACHE_SECONDS.
      console.warn("Unable to invalidate API key cache", error);
    }
  };

  return {
    async authenticateApiKeyUseCase(token, clientIp) {
      if (!isApiKeyFormat(token)) return { status: "invalid" };

      const keyHash = hashApiKey(token);

      try {
        const cached = await cacheService.get<ApiKeyPrincipal | typeof MISS>(
          authCacheKey(keyHash),
        );
        if (cached === MISS) return { status: "invalid" };
        if (
          cached &&
          (!cached.expiresAt ||
            new Date(cached.expiresAt).getTime() > Date.now())
        ) {
          return { status: "ok", principal: cached };
        }
      } catch (error) {
        console.warn("API key cache unavailable; falling back", error);
      }

      // Only cache misses reach the database, so cap them per client: random
      // well-formed tokens would otherwise each cost a query. Fails closed: in
      // a Redis outage every request would otherwise reach the database.
      try {
        const lookup = await rateLimitService.limitAuthLookup(clientIp);
        if (lookup && !lookup.success) return { status: "throttled" };
      } catch (error) {
        console.error("API key lookup limiter unavailable", error);
        return { status: "unavailable" };
      }

      const principal = await apiKeysRepository.findActiveByHash(keyHash);

      if (!principal) {
        await cacheMiss(keyHash);
        return { status: "invalid" };
      }

      // Only lookups record use, so `last_used_at` is at most about
      // AUTH_CACHE_SECONDS stale and costs one write per key per window.
      const [cached, used] = await Promise.allSettled([
        // nx: a lookup that raced a revocation must not overwrite its marker.
        cacheService.setIfAbsent(
          authCacheKey(keyHash),
          principal,
          AUTH_CACHE_SECONDS,
        ),
        apiKeysRepository.markUsed(principal.id),
      ]);
      if (cached.status === "rejected") {
        console.warn("Unable to cache API key lookup", cached.reason);
      }
      if (used.status === "rejected") {
        console.warn("Unable to record API key use", {
          keyId: principal.id,
          error: used.reason,
        });
      }

      return { status: "ok", principal };
    },

    limitApiKeyRequestsUseCase(principal) {
      return rateLimitService.limitApiKey(
        principal.id,
        principal.rateLimitPerMinute,
      );
    },

    invalidateApiKeysUseCase: invalidate,

    listApiKeysUseCase(userId) {
      return apiKeysRepository.listForUser(userId);
    },

    async createApiKeyUseCase(userId, { name, expiresInDays }) {
      // Not atomic: two concurrent creates can both pass. Acceptable for a
      // settings form; the cap only bounds abuse of per-key rate limits.
      if (
        (await apiKeysRepository.countActiveForUser(userId)) >=
        MAX_ACTIVE_API_KEYS
      ) {
        throw new ConflictError(
          `You can have at most ${MAX_ACTIVE_API_KEYS} active API keys. Revoke one to create another.`,
        );
      }

      const { plaintext, keyPrefix, keyHash } = generateApiKey();

      const { id } = await apiKeysRepository.insert({
        userId,
        name,
        keyPrefix,
        keyHash,
        // Keys are read-only until the public API has write routes and
        // enforces `read_write` (see the roadmap, Phase 1.5).
        permission: "read",
        rateLimitPerMinute: API_KEY_RATE_LIMIT_PER_MINUTE,
        expiresAt: expiresInDays
          ? new Date(Date.now() + expiresInDays * DAY_MS).toISOString()
          : null,
      });

      return { id, key_prefix: keyPrefix, plaintext };
    },

    async revokeApiKeyUseCase(userId, id) {
      const keyHash = await apiKeysRepository.revoke({ id, userId });
      if (!keyHash) {
        throw new NotFoundError(
          "The API key was not found or is already revoked.",
        );
      }

      // Otherwise the cached principal keeps authenticating until its TTL.
      await invalidate(keyHash);
    },

    async deleteApiKeyUseCase(userId, id) {
      // No cache work: only inactive keys match, and their cached auth is
      // already a miss (revoked) or rejected by its `expiresAt` (expired).
      if (!(await apiKeysRepository.deleteInactive({ id, userId }))) {
        throw new NotFoundError(
          "The API key was not found or is still active. Revoke it first.",
        );
      }
    },

    async revokeUserApiKeysUseCase(userId) {
      await invalidate(...(await apiKeysRepository.revokeAllForUser(userId)));
    },
  };
};
