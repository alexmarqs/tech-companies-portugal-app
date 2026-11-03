import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { errorBody } from "../lib/api-error";
import type { RateLimitResult } from "../services/ratelimit/types";
import type { ApiKeysUseCases } from "../use-cases/api-keys/types";

const getBearerToken = (authorization: string | undefined) => {
  if (!authorization) return null;
  const match = /^Bearer ([^\s]+)$/.exec(authorization);
  return match?.[1] ?? null;
};

const isProdEnv = process.env.NODE_ENV === "production";

// Vercel sets x-forwarded-for itself, so the first entry is the client.
const getClientIp = (forwardedFor: string | undefined, realIp?: string) =>
  forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

/** Redis is down (or, in production, not configured): no limiting, no API. */
const unavailable = (c: Context) => {
  c.header("Retry-After", "60");
  return c.json(
    errorBody({
      code: "rate_limiter_unavailable",
      message: "API rate limiting is temporarily unavailable.",
    }),
    503,
  );
};

export const withRequireApiKey = (apiKeys: ApiKeysUseCases) =>
  createMiddleware(async (c, next) => {
    const token = getBearerToken(c.req.header("Authorization"));

    const result = token
      ? await apiKeys.authenticateApiKeyUseCase(
          token,
          getClientIp(
            c.req.header("x-forwarded-for"),
            c.req.header("x-real-ip"),
          ),
        )
      : ({ status: "invalid" } as const);

    if (result.status === "unavailable") return unavailable(c);

    if (result.status === "throttled") {
      c.header("Retry-After", "60");

      return c.json(
        errorBody({
          code: "too_many_auth_attempts",
          message: "Too many requests with unrecognized API keys.",
        }),
        429,
      );
    }

    if (result.status === "invalid") {
      c.header(
        "WWW-Authenticate",
        'Bearer realm="Tech Companies Portugal API"',
      );
      return c.json(
        errorBody({
          code: "invalid_api_key",
          message: "A valid API key is required.",
        }),
        401,
      );
    }

    const { principal } = result;

    let rateLimit: RateLimitResult | null;

    try {
      rateLimit = await apiKeys.limitApiKeyRequestsUseCase(principal);
    } catch (error) {
      // Fails closed: an unlimited API would pass the outage on to Supabase.
      console.error("API rate limiter unavailable; rejecting request", {
        requestId: c.get("requestId"),
        keyId: principal.id,
        error,
      });
      return unavailable(c);
    }

    if (!rateLimit && isProdEnv) return unavailable(c);

    if (rateLimit) {
      c.header("X-RateLimit-Limit", String(rateLimit.limit));
      c.header("X-RateLimit-Remaining", String(rateLimit.remaining));
      c.header("X-RateLimit-Reset", String(Math.ceil(rateLimit.reset / 1000)));

      if (!rateLimit.success) {
        c.header(
          "Retry-After",
          String(Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000))),
        );
        return c.json(
          errorBody({
            code: "rate_limit_exceeded",
            message: "API rate limit exceeded.",
          }),
          429,
        );
      }
    }

    await next();
  });
