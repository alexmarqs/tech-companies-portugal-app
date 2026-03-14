import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const isConfigured = url && token;

if (!isConfigured && process.env.NODE_ENV === "production") {
  throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
}

export const upstashClient = isConfigured
  ? new Redis({ url, token })
  : undefined;
