import { z } from "@hono/zod-openapi";

// The source of truth for both runtime validation and OpenAPI.

export const CategoryReferenceSchema = z
  .object({
    slug: z.string().openapi({ example: "fintech" }),
    name: z.string().openapi({ example: "FinTech" }),
  })
  .openapi("CategoryReference");

const CategorySchema = CategoryReferenceSchema.extend({
  companyCount: z.number().int().nonnegative().openapi({ example: 85 }),
}).openapi("Category");

export const CategoriesResponseSchema = z
  .object({ data: z.array(CategorySchema) })
  .openapi("CategoriesResponse");
