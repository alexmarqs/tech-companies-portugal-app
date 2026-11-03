import { type ClientRequestOptions, hc } from "hono/client";
import type { InternalApp } from "./routes/internal";

// Browser-safe entry: only `hono/client` at runtime; the app is imported as a
// type, so no server code reaches the client bundle.

export type { InternalApp };
export type { InferRequestType, InferResponseType } from "hono/client";

/** Typed client for the web app's session-authenticated `/api/internal` routes. */
export const createInternalClient = (
  baseUrl = "/api/internal",
  options?: ClientRequestOptions,
) => hc<InternalApp>(baseUrl, options);

export type InternalClient = ReturnType<typeof createInternalClient>;
