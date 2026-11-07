import type { Company } from "@tech-companies-portugal/core";
import type { FilterDefinition } from "../../lib/filters";

/** Filters are slugs (`fintech`), never display or source names. */
export type CompanyFilter = {
  category?: string;
  location?: string;
};

/** Keyset page: up to `limit` companies whose slug sorts after `after`. */
export type CompanyPage = {
  limit: number;
  after?: string;
};

export type CompanyPageResult = {
  companies: Company[];
  total: number;
  hasMore: boolean;
  updatedAt: string | null;
};

export type CatalogService = {
  /**
   * One page of the companies matching every given filter, in slug
   * (code-unit) order.
   */
  listCompanies: (
    filter: CompanyFilter,
    page: CompanyPage,
  ) => Promise<CompanyPageResult>;
  findCompanyBySlug: (slug: string) => Promise<Company | null>;
  /** Categories with at least one company, in slug order. */
  listCategories: () => Promise<FilterDefinition[]>;
  /** Locations with at least one company, in slug order. */
  listLocations: () => Promise<FilterDefinition[]>;
};
