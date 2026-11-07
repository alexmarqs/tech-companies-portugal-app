import type { z } from "@hono/zod-openapi";
import {
  type Company,
  getCategoryList,
  normalizeText,
  toFilterSlug,
} from "@tech-companies-portugal/core";
import type { CompaniesUseCases } from "../../../use-cases/companies/types";
import type { CompaniesResponseSchema, CompanyResponseSchema } from "./schemas";

type CompanyResponse = z.infer<typeof CompanyResponseSchema>;
type CompaniesResponse = z.infer<typeof CompaniesResponseSchema>;
type CompaniesPage = Awaited<
  ReturnType<CompaniesUseCases["listCompaniesUseCase"]>
>;

const toReference = (name: string) => ({
  slug: toFilterSlug(name),
  name: normalizeText(name),
});

const toCompany = (company: Company): CompanyResponse["data"] => ({
  slug: company.slug,
  name: company.name,
  description: company.description,
  websiteUrl: company.websiteUrl || undefined,
  careersUrl: company.careersUrl || undefined,
  githubUrl: company.githubUrl || undefined,
  instagramUrl: company.instagramUrl || undefined,
  facebookUrl: company.facebookUrl || undefined,
  categories: getCategoryList(company.categories).map(toReference),
  locations: company.locations.map(toReference),
});

export const toCompanyResponse = (company: Company): CompanyResponse => ({
  data: toCompany(company),
});

export const toCompaniesResponse = (
  page: CompaniesPage,
): CompaniesResponse => ({
  data: page.data.map(toCompany),
  meta: {
    total: page.meta.total,
    nextCursor: page.meta.nextCursor,
    updatedAt: page.meta.updatedAt ?? undefined,
  },
});
