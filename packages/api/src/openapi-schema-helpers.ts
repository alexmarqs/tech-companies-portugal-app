import { z } from "@hono/zod-openapi";

// Shared by every route: the error shape and the request/response helpers.
// Resource schemas live next to their routes (`routes/*/<resource>/schemas.ts`).

const ErrorDetailSchema = z
  .object({
    code: z.string(),
    message: z.string(),
    path: z.string(),
  })
  .openapi("ErrorDetail");

export const ErrorSchema = z
  .object({
    error: z.object({
      code: z.string().openapi({ example: "validation_error" }),
      message: z.string(),
      details: z.array(ErrorDetailSchema).optional(),
    }),
  })
  .openapi("Error");

export const jsonContent = <T extends z.ZodType>(
  schema: T,
  description: string,
) => ({
  content: { "application/json": { schema } },
  description,
});

// Always required: an optional body skips validation when Content-Type is
// missing, handing the handler `{}` as if it had passed the schema.
export const jsonBody = <T extends z.ZodType>(schema: T) => ({
  body: {
    content: { "application/json": { schema } },
    required: true,
  },
});
