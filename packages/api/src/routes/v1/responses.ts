import { ErrorSchema, jsonContent } from "../../openapi-schema-helpers";

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

/** What the API key middleware and the error handler can return on any v1 route. */
export const protectedErrors = {
  401: unauthorizedError,
  429: rateLimitError,
  500: internalError,
  503: unavailableError,
} as const;
