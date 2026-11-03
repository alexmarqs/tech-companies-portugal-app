import type { Company } from "@tech-companies-portugal/core";
import { getParsedCompaniesData } from "@tech-companies-portugal/core/server";
import { buildFilterDefinitions, toFilterSlug } from "../../lib/filters";
import type { CatalogService } from "./types";

const categoryNames = (company: Company) =>
  Array.isArray(company.categories) ? company.categories : [company.categories];

const hasSlug = (names: string[], slug: string | undefined) =>
  !slug || names.some((name) => toFilterSlug(name) === slug);

/** Code-unit order, so it agrees with `slug > after` (SQL: COLLATE "C"). */
const bySlug = (a: Company, b: Company) =>
  a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;

/**
 * Filters and pages the cached companies catalog shared with the site, in
 * memory, so API traffic never reaches the database. The keyset page (`slug >
 * after`, `limit + 1` rows for `hasMore`) maps to `WHERE slug > $after ORDER BY
 * slug COLLATE "C" LIMIT $limit + 1`, so a database-backed adapter keeps the
 * API contract. Only switch for full-text search, a catalog too big to load
 * per request, or fresher data than the daily sync.
 */
export const createCoreCatalogService = (): CatalogService => ({
  async listCompanies({ category, location }, { limit, after }) {
    try {
      const { companies, updatedAtISODate } = await getParsedCompaniesData();

      const matching = companies
        .filter(
          (company) =>
            hasSlug(categoryNames(company), category) &&
            hasSlug(company.locations, location),
        )
        .sort(bySlug);

      const page = matching
        .filter((company) => !after || company.slug > after)
        .slice(0, limit + 1);

      return {
        companies: page.slice(0, limit),
        total: matching.length,
        hasMore: page.length > limit,
        updatedAt: updatedAtISODate ?? null,
      };
    } catch (error) {
      throw new Error("[CoreCatalogService] Error listing companies", {
        cause: error,
      });
    }
  },

  async findCompanyBySlug(slug) {
    try {
      const { companies } = await getParsedCompaniesData();
      return companies.find((company) => company.slug === slug) ?? null;
    } catch (error) {
      throw new Error("[CoreCatalogService] Error finding company", {
        cause: error,
      });
    }
  },

  async listCategories() {
    try {
      const { companies } = await getParsedCompaniesData();
      return buildFilterDefinitions(companies.map(categoryNames));
    } catch (error) {
      throw new Error("[CoreCatalogService] Error listing categories", {
        cause: error,
      });
    }
  },

  async listLocations() {
    try {
      const { companies } = await getParsedCompaniesData();
      return buildFilterDefinitions(
        companies.map((company) => company.locations),
      );
    } catch (error) {
      throw new Error("[CoreCatalogService] Error listing locations", {
        cause: error,
      });
    }
  },
});
