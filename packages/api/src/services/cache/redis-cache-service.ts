import type { Redis } from "@upstash/redis";
import type { CacheService } from "./types";

export const createRedisCacheService = ({
  redis,
}: {
  redis: Redis;
}): CacheService => ({
  async get(key) {
    try {
      return await redis.get(key);
    } catch (error) {
      throw new Error("[RedisCacheService] Error getting cache key", {
        cause: error,
      });
    }
  },

  async set(key, value, ttlSeconds) {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      throw new Error("[RedisCacheService] Error setting cache key", {
        cause: error,
      });
    }
  },

  async setIfAbsent(key, value, ttlSeconds) {
    try {
      await redis.set(key, value, { ex: ttlSeconds, nx: true });
    } catch (error) {
      throw new Error("[RedisCacheService] Error setting cache key if absent", {
        cause: error,
      });
    }
  },
});
