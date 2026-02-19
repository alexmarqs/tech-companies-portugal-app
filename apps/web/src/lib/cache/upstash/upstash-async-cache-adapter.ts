import type { Redis } from "@upstash/redis";
import type { AsyncCache } from "../types";

type UpstashAsyncCacheAdapterOptions = {
  keyPrefix: string;
  ttlSeconds: number;
};

export function createUpstashAsyncCacheAdapter<T>(
  client: Redis,
  options: UpstashAsyncCacheAdapterOptions,
): AsyncCache<T> {
  return {
    get: async (key: string) => {
      return await client.get<T>(`${options.keyPrefix}:${key}`);
    },
    set: async (key: string, value: T) => {
      await client.set(`${options.keyPrefix}:${key}`, value, {
        ex: options.ttlSeconds,
      });
    },
  };
}
