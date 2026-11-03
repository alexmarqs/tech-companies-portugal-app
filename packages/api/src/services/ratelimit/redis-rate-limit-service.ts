import { Ratelimit } from "@upstash/ratelimit";
import type { Redis } from "@upstash/redis";
import type { RateLimitService } from "./types";

/** Database lookups (cache misses) allowed per client IP. */
const AUTH_LOOKUPS_PER_MINUTE = 30;

export const createRedisRateLimitService = ({
  redis,
  limiterCache = new Map(),
}: {
  redis: Redis;
  /** Limiters reused across requests, one per requests-per-minute value. */
  limiterCache?: Map<number, Ratelimit>;
}): RateLimitService => {
  const authLookupLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AUTH_LOOKUPS_PER_MINUTE, "1 m"),
    prefix: "tcp:api-auth-lookup",
  });

  const getApiRateLimiter = (requestsPerMinute: number) => {
    const existing = limiterCache.get(requestsPerMinute);
    if (existing) return existing;

    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requestsPerMinute, "1 m"),
      prefix: "tcp:api-rate-limit",
    });
    limiterCache.set(requestsPerMinute, limiter);
    return limiter;
  };

  return {
    async limitAuthLookup(clientIp) {
      try {
        return await authLookupLimiter.limit(clientIp);
      } catch (error) {
        throw new Error("[RedisRateLimitService] Error limiting auth lookup", {
          cause: error,
        });
      }
    },

    async limitApiKey(keyId, requestsPerMinute) {
      try {
        return await getApiRateLimiter(requestsPerMinute).limit(keyId);
      } catch (error) {
        throw new Error("[RedisRateLimitService] Error limiting API key", {
          cause: error,
        });
      }
    },
  };
};
