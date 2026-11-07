import type { z } from "@hono/zod-openapi";
import type { FilterDefinition } from "../../../lib/filters";
import type { CategoriesResponseSchema } from "./schemas";

type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

const toCategory = (
  category: FilterDefinition,
): CategoriesResponse["data"][number] => ({
  slug: category.slug,
  name: category.name,
  companyCount: category.companyCount,
});

export const toCategoriesResponse = (
  categories: FilterDefinition[],
): CategoriesResponse => ({
  data: categories.map(toCategory),
});
