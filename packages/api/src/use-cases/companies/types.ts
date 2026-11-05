import type { Company } from "@tech-companies-portugal/core";
import type { FilterDefinition } from "../../lib/filters";

export type CompaniesUseCases = {
  getCompanyUseCase: (slug: string) => Promise<Company>;
  /** Throws `ValidationError` for an unknown filter or a malformed cursor. */
  listCompaniesUseCase: (query: {
    category?: string;
    location?: string;
    limit: number;
    /** Opaque, from a previous page's `meta.nextCursor`. */
    cursor?: string;
  }) => Promise<{
    data: Company[];
    meta: {
      total: number;
      nextCursor: string | null;
      updatedAt: string | null;
    };
  }>;
  listCategoriesUseCase: () => Promise<FilterDefinition[]>;
  listLocationsUseCase: () => Promise<FilterDefinition[]>;
};
