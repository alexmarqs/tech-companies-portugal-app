import type { CacheService } from "./types";

/** Used when Redis is not configured: every read misses, writes are dropped. */
export const noopCacheService: CacheService = {
  get: async () => null,
  set: async () => {},
  setIfAbsent: async () => {},
};
