import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import type { ApiKeysRepository } from "../../services/api-keys/types";
import type { CacheService } from "../../services/cache/types";
import { noopRateLimitService } from "../../services/ratelimit/noop-rate-limit-service";
import { ConflictError, NotFoundError } from "../errors";
import { createApiKeysUseCases } from "./api-keys";

const USER_ID = "22222222-2222-4222-8222-222222222222";
const KEY_ID = "11111111-1111-4111-8111-111111111111";

const setup = () => {
  const apiKeys = {
    findActiveByHash: vi.fn<ApiKeysRepository["findActiveByHash"]>(
      async () => null,
    ),
    listForUser: vi.fn<ApiKeysRepository["listForUser"]>(async () => []),
    countActiveForUser: vi.fn<ApiKeysRepository["countActiveForUser"]>(
      async () => 0,
    ),
    markUsed: vi.fn<ApiKeysRepository["markUsed"]>(async () => {}),
    insert: vi.fn<ApiKeysRepository["insert"]>(async () => ({ id: KEY_ID })),
    revoke: vi.fn<ApiKeysRepository["revoke"]>(async () => null),
    deleteInactive: vi.fn<ApiKeysRepository["deleteInactive"]>(
      async () => false,
    ),
    revokeAllForUser: vi.fn<ApiKeysRepository["revokeAllForUser"]>(
      async () => [],
    ),
  } satisfies ApiKeysRepository;
  const cache = {
    get: vi.fn(async () => null),
    set: vi.fn(async () => {}),
    setIfAbsent: vi.fn(async () => {}),
  } satisfies CacheService;

  return {
    apiKeys,
    cache,
    useCases: createApiKeysUseCases({
      apiKeysRepository: apiKeys,
      cacheService: cache,
      rateLimitService: noopRateLimitService,
    }),
  };
};

describe("api keys use cases", () => {
  it("returns the plaintext once and persists only its digest", async () => {
    const { apiKeys, useCases } = setup();

    const created = await useCases.createApiKeyUseCase(USER_ID, {
      name: "Production",
      expiresInDays: null,
    });

    expect(created.id).toBe(KEY_ID);
    expect(created.plaintext).toMatch(/^tcp_live_[A-Za-z0-9_-]{43}$/);
    expect(created.key_prefix).toBe(created.plaintext.slice(0, 20));

    const inserted = apiKeys.insert.mock.calls[0]?.[0];
    expect(inserted).toEqual({
      userId: USER_ID,
      name: "Production",
      keyPrefix: created.key_prefix,
      keyHash: createHash("sha256").update(created.plaintext).digest("hex"),
      permission: "read",
      rateLimitPerMinute: 60,
      expiresAt: null,
    });
    expect(JSON.stringify(inserted)).not.toContain(created.plaintext);
  });

  it("refuses a key once the user holds the maximum", async () => {
    const { apiKeys, useCases } = setup();
    apiKeys.countActiveForUser.mockResolvedValue(2);

    await expect(
      useCases.createApiKeyUseCase(USER_ID, {
        name: "Third",
        expiresInDays: null,
      }),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(apiKeys.countActiveForUser).toHaveBeenCalledWith(USER_ID);
    expect(apiKeys.insert).not.toHaveBeenCalled();
  });

  it("sets the expiry from the number of days", async () => {
    const { apiKeys, useCases } = setup();
    const before = Date.now();

    await useCases.createApiKeyUseCase(USER_ID, {
      name: "CI",
      expiresInDays: 30,
    });

    const expiresAt = Date.parse(
      apiKeys.insert.mock.calls[0]?.[0].expiresAt ?? "",
    );
    expect(expiresAt - before).toBeGreaterThanOrEqual(30 * 24 * 60 * 60_000);
    expect(expiresAt - Date.now()).toBeLessThanOrEqual(30 * 24 * 60 * 60_000);
  });

  it("revokes the user's key and drops its cached auth", async () => {
    const { apiKeys, cache, useCases } = setup();
    apiKeys.revoke.mockResolvedValue("a".repeat(64));

    await useCases.revokeApiKeyUseCase(USER_ID, KEY_ID);

    expect(apiKeys.revoke).toHaveBeenCalledWith({
      id: KEY_ID,
      userId: USER_ID,
    });
    expect(cache.set).toHaveBeenCalledWith(
      `tcp:api-key:${"a".repeat(64)}`,
      "miss",
      60,
    );
  });

  it("throws NotFoundError for an unknown or already revoked key", async () => {
    const { cache, useCases } = setup();

    await expect(
      useCases.revokeApiKeyUseCase(USER_ID, KEY_ID),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(cache.set).not.toHaveBeenCalled();
  });

  it("deletes the user's inactive key", async () => {
    const { apiKeys, useCases } = setup();
    apiKeys.deleteInactive.mockResolvedValue(true);

    await useCases.deleteApiKeyUseCase(USER_ID, KEY_ID);

    expect(apiKeys.deleteInactive).toHaveBeenCalledWith({
      id: KEY_ID,
      userId: USER_ID,
    });
  });

  it("throws NotFoundError for an unknown or still active key", async () => {
    const { useCases } = setup();

    await expect(
      useCases.deleteApiKeyUseCase(USER_ID, KEY_ID),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("revokes all of the user's keys and drops their cached auth", async () => {
    const { apiKeys, cache, useCases } = setup();
    apiKeys.revokeAllForUser.mockResolvedValue(["hash-1", "hash-2"]);

    await useCases.revokeUserApiKeysUseCase(USER_ID);

    expect(apiKeys.revokeAllForUser).toHaveBeenCalledWith(USER_ID);
    expect(cache.set).toHaveBeenCalledWith("tcp:api-key:hash-1", "miss", 60);
    expect(cache.set).toHaveBeenCalledWith("tcp:api-key:hash-2", "miss", 60);
  });

  it("records use on a database lookup, not on a cache hit", async () => {
    const { apiKeys, cache, useCases } = setup();
    const token = `tcp_live_${"a".repeat(43)}`;
    const principal = {
      id: KEY_ID,
      userId: USER_ID,
      keyPrefix: token.slice(0, 20),
      permission: "read" as const,
      rateLimitPerMinute: 60,
      expiresAt: null,
    };
    apiKeys.findActiveByHash.mockResolvedValue(principal);

    await useCases.authenticateApiKeyUseCase(token, "203.0.113.1");
    expect(apiKeys.markUsed).toHaveBeenCalledExactlyOnceWith(KEY_ID);

    cache.get.mockResolvedValue(principal as never);
    await useCases.authenticateApiKeyUseCase(token, "203.0.113.1");
    expect(apiKeys.markUsed).toHaveBeenCalledOnce();
  });

  it("still authenticates when recording use fails", async () => {
    const { apiKeys, useCases } = setup();
    apiKeys.findActiveByHash.mockResolvedValue({
      id: KEY_ID,
      userId: USER_ID,
      keyPrefix: "tcp_live_aaaaaaaaaaa",
      permission: "read",
      rateLimitPerMinute: 60,
      expiresAt: null,
    });
    apiKeys.markUsed.mockRejectedValue(new Error("db down"));
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await useCases.authenticateApiKeyUseCase(
      `tcp_live_${"a".repeat(43)}`,
      "203.0.113.1",
    );

    expect(result.status).toBe("ok");
  });
});
