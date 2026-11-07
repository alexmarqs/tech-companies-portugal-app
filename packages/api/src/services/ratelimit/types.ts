export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export type RateLimitService = {
  /** Caps cache misses that reach the database. Null when limiting is off. */
  limitAuthLookup: (clientIp: string) => Promise<{ success: boolean } | null>;
  /** Per-key request quota. Null when limiting is off. */
  limitApiKey: (
    keyId: string,
    requestsPerMinute: number,
  ) => Promise<RateLimitResult | null>;
};
