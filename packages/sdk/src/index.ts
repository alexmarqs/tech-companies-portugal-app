import createFetchClient, {
  type Client,
  type ClientOptions as FetchClientOptions,
  type Middleware,
} from "openapi-fetch";
import type { components, operations, paths } from "./generated/schema";

const DEFAULT_BASE_URL = "https://techcompaniesportugal.fyi/api/v1";

interface ClientOptions {
  apiKey?: string;
  baseUrl?: string;
  fetch?: FetchClientOptions["fetch"];
}

/**
 * Creates a client for the Tech Companies Portugal API.
 *
 * If you send `If-None-Match`, an unchanged resource comes back as a 304 with
 * no `data` and `error` set to `""` (openapi-fetch doesn't type 3xx), so check
 * `response.status === 304` before reading `data`.
 */
export function createClient({
  apiKey,
  baseUrl = DEFAULT_BASE_URL,
  fetch,
}: ClientOptions = {}): TechCompaniesPortugalClient {
  // openapi-fetch falls back to `globalThis.fetch` when `fetch` is undefined.
  const client = createFetchClient<paths>({ baseUrl, fetch });

  if (apiKey) {
    const authMiddleware: Middleware = {
      onRequest({ request }) {
        if (!request.headers.has("Authorization")) {
          request.headers.set("Authorization", `Bearer ${apiKey}`);
        }
        return request;
      },
    };

    client.use(authMiddleware);
  }

  return client;
}

// Singleton client, cached to avoid creating a new client for each request
let client: TechCompaniesPortugalClient | undefined;

/**
 * Shared client configured from `TCP_API_KEY` and `TCP_BASE_URL`, created on
 * first call. It is shared by every caller: pass per-user auth or other
 * request-specific middleware in a request's options (`headers`,
 * `middleware`), not with `use()`, which applies to all callers for good.
 */
export function getClient(): TechCompaniesPortugalClient {
  if (!client) {
    // `process` can be missing in browsers and some edge runtimes.
    const env = typeof process === "undefined" ? undefined : process.env;

    client = createClient({
      apiKey: env?.TCP_API_KEY,
      baseUrl: env?.TCP_BASE_URL || DEFAULT_BASE_URL,
    });
  }
  return client;
}

type Schemas = components["schemas"];

// export type { components, operations, paths };
export type TechCompaniesPortugalClient = Client<paths>;
export type Company = Schemas["Company"];
export type CompaniesResponse = Schemas["CompaniesResponse"];
export type CategoryReference = Schemas["CategoryReference"];
export type Category = Schemas["Category"];
export type LocationReference = Schemas["LocationReference"];
export type Location = Schemas["Location"];
export type ApiErrorBody = Schemas["Error"];
export type ListCompaniesQuery = NonNullable<
  operations["listCompanies"]["parameters"]["query"]
>;
