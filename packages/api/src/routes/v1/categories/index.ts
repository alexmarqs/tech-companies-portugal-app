import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { companiesUseCases } from "../../../composition-root";
import { zodValidationHook } from "../../../middleware/zod-validation-hook";
import { jsonContent } from "../../../openapi-schema-helpers";
import { protectedErrors } from "../responses";
import { toCategoriesResponse } from "./mappers";
import { CategoriesResponseSchema } from "./schemas";

const listCategoriesRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listCategories",
  summary: "List categories",
  description: "Lists every supported category slug and its company count.",
  tags: ["Categories"],
  responses: {
    200: jsonContent(CategoriesResponseSchema, "Available categories"),
    ...protectedErrors,
  },
});

/** Mounted at `/categories`. */
export const categoriesApp = new OpenAPIHono({
  defaultHook: zodValidationHook,
}).openapi(listCategoriesRoute, async (c) => {
  const categories = await companiesUseCases.listCategoriesUseCase();
  return c.json(toCategoriesResponse(categories), 200);
});
