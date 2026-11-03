import { hashApiKey } from "@tech-companies-portugal/security";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../app";
import { apiKeysUseCases } from "../composition-root";

const VALID_KEY = `tcp_live_${"a".repeat(43)}`;
const UNKNOWN_KEY = `tcp_live_${"b".repeat(43)}`;

// vi.hoisted runs before the imports above, so Upstash is configured before
// the Redis client reads the environment.
const fakes = vi.hoisted(() => {
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.com";
  process.env.UPSTASH_REDIS_REST_TOKEN = "token";

  return {
    store: new Map<string, unknown>(),
    // Per limiter prefix: what `limit()` does.
    limit: {} as Record<string, (id: string) => Promise<{ success: boolean }>>,
    getActiveApiKeyByHash: vi.fn(),
  };
});

vi.mock("@upstash/redis", () => ({
  Redis: class {
    get = async (key: string) => fakes.store.get(key) ?? null;
    set = async (key: string, value: unknown, opts?: { nx?: boolean }) => {
      if (opts?.nx && fakes.store.has(key)) return null;
      fakes.store.set(key, value);
      return "OK";
    };
    del = async (key: string) => {
      fakes.store.delete(key);
    };
  },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow = () => ({});
    constructor(private readonly options: { prefix: string }) {}
    limit = (id: string) =>
      fakes.limit[this.options.prefix]?.(id) ??
      Promise.resolve({ success: true });
  },
}));

vi.mock("@tech-companies-portugal/db/server", () => ({
  createAdminClient: async () => ({}),
  createClient: async () => ({}),
}));

vi.mock("@tech-companies-portugal/db/queries", () => ({
  getActiveApiKeyByHash: fakes.getActiveApiKeyByHash,
  markApiKeyUsed: async () => {},
}));

vi.mock("@tech-companies-portugal/core/server", () => ({
  getParsedCompaniesData: async () => ({ companies: [], updatedAtISODate: "" }),
}));

const row = {
  id: "11111111-1111-4111-8111-111111111111",
  user_id: "22222222-2222-4222-8222-222222222222",
  key_prefix: "tcp_live_test",
  permission: "read",
  rate_limit_per_minute: 60,
  expires_at: null,
};

const request = (key: string, ip = "203.0.113.1") =>
  app.request("/api/v1/categories", {
    headers: { Authorization: `Bearer ${key}`, "x-forwarded-for": ip },
  });

const okLimit = async () => ({
  success: true,
  limit: 60,
  remaining: 59,
  reset: Date.now() + 60_000,
});

describe("API key auth with Upstash", () => {
  beforeEach(() => {
    fakes.store.clear();
    fakes.limit = { "tcp:api-rate-limit": okLimit };
    fakes.getActiveApiKeyByHash.mockReset();
    fakes.getActiveApiKeyByHash.mockImplementation(
      async (_client: unknown, keyHash: string) =>
        keyHash === hashApiKey(VALID_KEY) ? row : null,
    );
  });

  it("fails open when the rate limiter errors", async () => {
    fakes.limit["tcp:api-rate-limit"] = async () => {
      throw new Error("Upstash down");
    };

    const response = await request(VALID_KEY);

    expect(response.status).toBe(200);
    expect(response.headers.get("X-RateLimit-Limit")).toBeNull();
  });

  it("still rejects unknown keys while the rate limiter errors", async () => {
    fakes.limit["tcp:api-rate-limit"] = async () => {
      throw new Error("Upstash down");
    };

    expect((await request(UNKNOWN_KEY)).status).toBe(401);
  });

  it("caches unknown keys so repeats skip the database", async () => {
    expect((await request(UNKNOWN_KEY)).status).toBe(401);
    expect((await request(UNKNOWN_KEY)).status).toBe(401);

    expect(fakes.getActiveApiKeyByHash).toHaveBeenCalledOnce();
  });

  it("throttles database lookups per client IP", async () => {
    fakes.limit["tcp:api-auth-lookup"] = async (ip) => ({
      success: ip !== "198.51.100.7",
    });

    const throttled = await request(UNKNOWN_KEY, "198.51.100.7, 10.0.0.1");

    expect(throttled.status).toBe(429);
    expect((await throttled.json()).error.code).toBe("too_many_auth_attempts");
    expect(fakes.getActiveApiKeyByHash).not.toHaveBeenCalled();
  });

  it("stops authenticating a key as soon as its cache entry is invalidated", async () => {
    expect((await request(VALID_KEY)).status).toBe(200);

    // Revoked in the database; the cached principal would still pass.
    fakes.getActiveApiKeyByHash.mockResolvedValue(null);
    expect((await request(VALID_KEY)).status).toBe(200);

    await apiKeysUseCases.invalidateApiKeysUseCase(hashApiKey(VALID_KEY));
    expect((await request(VALID_KEY)).status).toBe(401);
  });

  it("keeps a revoked key out of the cache when a lookup raced the revocation", async () => {
    // The lookup reads the row while it is still active...
    let finishLookup = () => {};
    fakes.getActiveApiKeyByHash.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishLookup = () => resolve(row);
        }),
    );
    const inFlight = request(VALID_KEY);
    await vi.waitFor(() =>
      expect(fakes.getActiveApiKeyByHash).toHaveBeenCalled(),
    );

    // ...the key is revoked, then the lookup tries to cache the stale row.
    await apiKeysUseCases.invalidateApiKeysUseCase(hashApiKey(VALID_KEY));
    finishLookup();
    await inFlight;

    fakes.getActiveApiKeyByHash.mockResolvedValue(row);
    expect((await request(VALID_KEY)).status).toBe(401);
  });
});
