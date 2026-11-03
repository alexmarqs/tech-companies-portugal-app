import { createClient } from "@tech-companies-portugal/db/server";
import { createMiddleware } from "hono/factory";
import { errorBody } from "../lib/api-error";

export type SessionEnv = { Variables: { userId: string } };

/**
 * Web-app session auth for internal routes. Reads the Supabase auth cookies of
 * the current Next.js request (the API is mounted in a Next route handler).
 *
 * This relies on the API sharing the web app's origin and Next process: the
 * browser sends the session cookies on same-origin `fetch` by default, and
 * `next/headers` can read them. `getClaims()` verifies the JWT signature, so
 * `sub` is trusted.
 *
 * If the API ever moves to its own origin (e.g. `api.` subdomain), switch to a
 * Bearer token rather than sharing cookies: the client sends
 * `Authorization: Bearer <access_token>` from `supabase.auth.getSession()` and
 * this reads it with `getClaims(token)`. That avoids CORS with credentials, a
 * cookie domain shared across subdomains, and cross-origin CSRF allowances.
 */
export const withRequireSession = createMiddleware<SessionEnv>(
  async (c, next) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const userId = error ? null : data?.claims.sub;

    if (!userId) {
      return c.json(
        errorBody({ code: "unauthorized", message: "You must be signed in." }),
        401,
      );
    }

    c.set("userId", userId);

    await next();
  },
);
