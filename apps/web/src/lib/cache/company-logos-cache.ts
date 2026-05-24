import { createUpstashAsyncCacheAdapter } from "./upstash/upstash-async-cache-adapter";
import { upstashClient } from "./upstash/upstash-client";

export type LogoEntry = { url: string | null; failedAt?: number };
export type LogoMap = Record<string, LogoEntry>;

export const COMPANY_LOGOS_MAP_KEY = "all";

export const companyLogosCache = createUpstashAsyncCacheAdapter<LogoMap>(
  upstashClient,
  {
    keyPrefix: "logos",
    ttlSeconds: 60 * 60 * 24 * 180, // 180 days
  },
);
