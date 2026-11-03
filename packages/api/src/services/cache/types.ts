export type CacheService = {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown, ttlSeconds: number) => Promise<void>;
  /** Skips the write when the key is already present. */
  setIfAbsent: (
    key: string,
    value: unknown,
    ttlSeconds: number,
  ) => Promise<void>;
};
