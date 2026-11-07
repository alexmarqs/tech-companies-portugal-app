import type { RateLimitService } from "./types";

/**
 * Used when Redis is not configured. Returns null ("limiting off"), which the
 * API key middleware turns into a 503 in production.
 */
export const noopRateLimitService: RateLimitService = {
  limitAuthLookup: async () => null,
  limitApiKey: async () => null,
};
