import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { errorBody } from "../lib/api-error";
import { UseCaseError, type UseCaseErrorCode } from "../use-cases/errors";
import type { SessionEnv } from "./session";

const statusByCode = {
  validation_error: 400,
  unauthorized: 401,
  not_found: 404,
  conflict: 409,
} satisfies Record<UseCaseErrorCode, ContentfulStatusCode>;

export const globalErrorHandler: ErrorHandler = (error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      errorBody({ code: "http_error", message: error.message }),
      error.status,
    );
  }

  if (error instanceof UseCaseError) {
    return c.json(
      errorBody({
        code: error.code,
        message: error.message,
        details: error.details,
      }),
      statusByCode[error.code],
    );
  }

  // Adapter failures and bugs: the only place they get logged.
  console.error("Unhandled API error", {
    requestId: c.get("requestId"),
    // Only set on session routes; undefined on public ones.
    userId: (c.var as Partial<SessionEnv["Variables"]>).userId,
    method: c.req.method,
    path: c.req.path,
    error,
  });

  return c.json(
    errorBody({
      code: "internal_error",
      message: "An unexpected error occurred.",
    }),
    500,
  );
};

export const notFoundHandler: NotFoundHandler = (c) => {
  return c.json(
    errorBody({ code: "route_not_found", message: "Route not found." }),
    404,
  );
};
