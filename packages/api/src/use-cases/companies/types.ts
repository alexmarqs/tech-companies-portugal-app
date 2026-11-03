import type { FilterDefinition } from "../../lib/filters";

export type CompanyView = {
  slug: string;
  name: string;
  description: string;
  websiteUrl: string | null;
  careersUrl: string | null;
  githubUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  logoUrl: string | null;
  categories: { slug: string; name: string }[];
  locations: { slug: string; name: string }[];
  isFeatured: boolean;
};

export type CompaniesUseCases = {
  getCompanyUseCase: (slug: string) => Promise<CompanyView>;
  /** Throws `ValidationError` for an unknown filter or a malformed cursor. */
  listCompaniesUseCase: (query: {
    category?: string;
    location?: string;
    limit: number;
    /** Opaque, from a previous page's `meta.nextCursor`. */
    cursor?: string;
  }) => Promise<{
    data: CompanyView[];
    meta: {
      total: number;
      nextCursor: string | null;
      updatedAt: string | null;
    };
  }>;
  listCategoriesUseCase: () => Promise<FilterDefinition[]>;
  listLocationsUseCase: () => Promise<FilterDefinition[]>;
};
