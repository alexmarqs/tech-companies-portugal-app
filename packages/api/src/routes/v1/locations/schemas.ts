import { z } from "@hono/zod-openapi";

// The source of truth for both runtime validation and OpenAPI.

export const LocationReferenceSchema = z
  .object({
    slug: z.string().openapi({ example: "lisboa" }),
    name: z.string().openapi({ example: "Lisboa" }),
  })
  .openapi("LocationReference");

const LocationSchema = LocationReferenceSchema.extend({
  companyCount: z.number().int().nonnegative().openapi({ example: 85 }),
}).openapi("Location");

export const LocationsResponseSchema = z
  .object({ data: z.array(LocationSchema) })
  .openapi("LocationsResponse");
