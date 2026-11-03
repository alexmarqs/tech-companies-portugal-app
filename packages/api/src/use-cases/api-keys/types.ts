import type {
  ApiKeyPrincipal,
  ApiKeySummary,
} from "../../services/api-keys/types";
import type { RateLimitResult } from "../../services/ratelimit/types";

export type AuthenticateResult =
  | { status: "ok"; principal: ApiKeyPrincipal }
  | { status: "invalid" }
  | { status: "throttled" }
  | { status: "unavailable" };

export type CreateApiKeyInput = {
  name: string;
  /** Null for a key that never expires. */
  expiresInDays: number | null;
};

/** The plaintext is returned exactly once and never stored. */
export type CreatedApiKey = {
  id: string;
  key_prefix: string;
  plaintext: string;
};

export type ApiKeysUseCases = {
  /** Resolves a bearer token to its key, from the cache when possible. */
  authenticateApiKeyUseCase: (
    token: string,
    clientIp: string,
  ) => Promise<AuthenticateResult>;
  /** Per-key request quota. Null when limiting is off; throws when it fails. */
  limitApiKeyRequestsUseCase: (
    principal: ApiKeyPrincipal,
  ) => Promise<RateLimitResult | null>;
  /** Stops cached auth for these key digests right away. */
  invalidateApiKeysUseCase: (...keyHashes: string[]) => Promise<void>;
  listApiKeysUseCase: (userId: string) => Promise<ApiKeySummary[]>;
  /** Throws `ConflictError` once the user holds `MAX_ACTIVE_API_KEYS`. */
  createApiKeyUseCase: (
    userId: string,
    input: CreateApiKeyInput,
  ) => Promise<CreatedApiKey>;
  /** Throws `NotFoundError` when the user has no such active key. */
  revokeApiKeyUseCase: (userId: string, id: string) => Promise<void>;
  /** Throws `NotFoundError` when the user has no such revoked or expired key. */
  deleteApiKeyUseCase: (userId: string, id: string) => Promise<void>;
  /** Revokes every active key of the user and drops their cached auth. */
  revokeUserApiKeysUseCase: (userId: string) => Promise<void>;
};
