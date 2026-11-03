import { Redis } from "@upstash/redis";

/** Null when Upstash is not configured (local dev without Redis). */
export const createRedisClient = (): Redis | null => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
};
