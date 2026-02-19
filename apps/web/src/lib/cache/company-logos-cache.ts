import { createUpstashAsyncCacheAdapter } from "./upstash/upstash-async-cache-adapter";
import { upstashClient } from "./upstash/upstash-client";

export const companyLogosCache = createUpstashAsyncCacheAdapter<string>(
  upstashClient,
  {
    keyPrefix: "logos",
    ttlSeconds: 60 * 60 * 24 * 180, // 180 days
  },
);
