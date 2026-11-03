import { z } from "@hono/zod-openapi";
import { CategoryReferenceSchema } from "../categories/schemas";
import { LocationReferenceSchema } from "../locations/schemas";

// The source of truth for both runtime validation and OpenAPI.

/** Default and maximum page size for `GET /companies`. */
const COMPANIES_PAGE_SIZE = 100;

const CompanySchema = z
  .object({
    slug: z.string().openapi({ example: "acme" }),
    name: z.string().openapi({ example: "Acme" }),
    description: z.string(),
    websiteUrl: z.url().nullable(),
    careersUrl: z.url().nullable(),
    githubUrl: z.url().nullable(),
    instagramUrl: z.url().nullable(),
    facebookUrl: z.url().nullable(),
    logoUrl: z.url().nullable(),
    categories: z.array(CategoryReferenceSchema),
    locations: z.array(LocationReferenceSchema),
    isFeatured: z.boolean(),
  })
  .openapi("Company");

export const CompaniesResponseSchema = z
  .object({
    data: z.array(CompanySchema),
    meta: z.object({
      total: z.number().int().nonnegative().openapi({
        example: 362,
        description: "Companies matching the filters, across all pages.",
      }),
      nextCursor: z.string().nullable().openapi({
        description:
          "Pass as `cursor` to get the next page; null on the last page.",
      }),
      updatedAt: z.iso.datetime().nullable().openapi({
        description: "When the directory data last changed.",
      }),
    }),
  })
  .openapi("CompaniesResponse");

export const CompanyResponseSchema = z
  .object({ data: CompanySchema })
  .openapi("CompanyResponse");

export const CompaniesQuerySchema = z.object({
  category: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .openapi({ example: "fintech" }),
  location: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .openapi({ example: "lisboa" }),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(COMPANIES_PAGE_SIZE)
    .default(COMPANIES_PAGE_SIZE)
    .openapi({ description: "Companies per page." }),
  cursor: z.string().max(400).optional().openapi({
    description: "`meta.nextCursor` from the previous page. Opaque.",
  }),
});

export const CompanyParamsSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .openapi({
      param: { name: "slug", in: "path" },
      example: "acme",
    }),
});
