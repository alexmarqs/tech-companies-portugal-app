import { OpenAPIHono } from "@hono/zod-openapi";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { type SessionEnv, withRequireSession } from "../../middleware/session";
import { zodValidationHook } from "../../middleware/zod-validation-hook";
import { apiKeysApp } from "./api-keys";
import { meApp } from "./me";

/**
 * Routes for the web app only: session auth, same origin, no CORS. A separate
 * app from v1, so its routes never reach the public OpenAPI document; it has
 * its own registry if an internal spec is ever needed. Handlers use the admin
 * client, which bypasses RLS, so every query must be scoped by the session's
 * `userId`.
 */
const internal = new OpenAPIHono<SessionEnv>({
  defaultHook: zodValidationHook,
});

// Defaults include Cross-Origin-Resource-Policy: same-origin, so other sites
// can't embed these cookie-authenticated responses (unlike v1's cross-origin).
internal.use("*", secureHeaders());
internal.use("*", csrf());
internal.use("*", withRequireSession);

// Internal spec, if ever needed: serve it outside production only. Here, after
// requireSession, it needs a signed-in session; above it, it is open in dev.
// if (process.env.NODE_ENV !== "production") {
//   internal.doc31("/openapi.json", {
//     openapi: "3.1.0",
//     info: { title: "Internal API", version: "0" },
//   });
// }

// Chained so `InternalApp` carries every route's types for `hc`.
export const internalApp = internal
  .route("/api-keys", apiKeysApp)
  .route("/me", meApp);

export type InternalApp = typeof internalApp;
