import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { companiesUseCases } from "../../../composition-root";
import { zodValidationHook } from "../../../middleware/zod-validation-hook";
import { ErrorSchema, jsonContent } from "../../../openapi-schema-helpers";
import { protectedErrors, validationError } from "../responses";
import { toCompaniesResponse, toCompanyResponse } from "./mappers";
import {
  CompaniesQuerySchema,
  CompaniesResponseSchema,
  CompanyParamsSchema,
  CompanyResponseSchema,
} from "./schemas";

const listCompaniesRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listCompanies",
  summary: "List companies",
  description:
    "Returns matching companies in slug order, one page at a time. Narrow the list with exact category and location filters, and follow `meta.nextCursor` until it is null.",
  tags: ["Companies"],
  request: { query: CompaniesQuerySchema },
  responses: {
    200: jsonContent(CompaniesResponseSchema, "A page of companies"),
    400: validationError,
    ...protectedErrors,
  },
});

const getCompanyRoute = createRoute({
  method: "get",
  path: "/{slug}",
  operationId: "getCompany",
  summary: "Get a company",
  tags: ["Companies"],
  request: { params: CompanyParamsSchema },
  responses: {
    200: jsonContent(CompanyResponseSchema, "Company details"),
    400: validationError,
    404: jsonContent(ErrorSchema, "Company not found"),
    ...protectedErrors,
  },
});

/** Mounted at `/companies`. */
export const companiesApp = new OpenAPIHono({ defaultHook: zodValidationHook })
  .openapi(listCompaniesRoute, async (c) => {
    const result = await companiesUseCases.listCompaniesUseCase(
      c.req.valid("query"),
    );
    return c.json(toCompaniesResponse(result), 200);
  })
  .openapi(getCompanyRoute, async (c) => {
    const { slug } = c.req.valid("param");
    const company = await companiesUseCases.getCompanyUseCase(slug);
    return c.json(toCompanyResponse(company), 200);
  });
