import { z } from "@hono/zod-openapi";
import { ErrorSchema, jsonContent } from "../../openapi-schema-helpers";

/** Documents the `ETag` that `etag()` adds to every v1 success response. */
export const withETag = <T extends object>(response: T) => ({
  ...response,
  headers: z.object({
    ETag: z.string().openapi({
      description:
        "Version of this response. Send it back as `If-None-Match` to get an empty 304 while it is unchanged.",
      example: '"a1b2c3d4"',
    }),
  }),
});

/** Error responses shared by every v1 route's OpenAPI definition. */
export const validationError = jsonContent(ErrorSchema, "Invalid request");

const unauthorizedError = jsonContent(
  ErrorSchema,
  "Invalid or missing API key",
);
const rateLimitError = jsonContent(ErrorSchema, "Rate limit exceeded");
const unavailableError = jsonContent(
  ErrorSchema,
  "Service temporarily unavailable",
);
const internalError = jsonContent(ErrorSchema, "Unexpected server error");

/** `etag()` on every v1 route: the request's `If-None-Match` still matches. */
export const notModified = {
  description:
    "Not modified: the `If-None-Match` header matches the current `ETag`. Empty body; reuse the cached response.",
};

/** What the API key middleware and the error handler can return on any v1 route. */
export const protectedErrors = {
  401: unauthorizedError,
  429: rateLimitError,
  500: internalError,
  503: unavailableError,
} as const;
