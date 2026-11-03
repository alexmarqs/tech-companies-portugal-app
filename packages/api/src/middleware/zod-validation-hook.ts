/** Shared `defaultHook` so public and internal routes report 400s alike. */

import type { Hook } from "@hono/zod-openapi";
import { errorBody } from "../lib/api-error";

// biome-ignore lint/suspicious/noExplicitAny: matches OpenAPIHono's defaultHook
export const zodValidationHook: Hook<any, any, any, any> = (result, c) => {
  if (result.success) return;

  return c.json(
    errorBody({
      code: "validation_error",
      message: "The request contains invalid parameters.",
      details: result.error.issues.map((issue) => ({
        code: issue.code,
        message: issue.message,
        path: issue.path.join("."),
      })),
    }),
    400,
  );
};
