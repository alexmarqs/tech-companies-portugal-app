import type { Tables } from "./supabase/database.types";
import type { Company } from "./types";

export type CompanyRow = Pick<
  Tables<"companies">,
  | "slug"
  | "name"
  | "description"
  | "website_url"
  | "careers_url"
  | "github_url"
  | "categories"
  | "locations"
  | "logo_url"
  | "is_featured"
  | "updated_at"
>;

export const COMPANY_ROW_COLUMNS =
  "slug, name, description, website_url, careers_url, github_url, categories, locations, logo_url, is_featured, updated_at";

const compareText = (a: string, b: string) =>
  a.localeCompare(b, "en", { sensitivity: "base" });

/**
 * Maps listed company rows to the shape the site rendered when it parsed the
 * README directly, so readers are unchanged. Display order is featured
 * first, then by name.
 */
export const buildCompaniesCatalogue = (rows: CompanyRow[]) => {
  const sortedRows = [...rows].sort(
    (a, b) =>
      Number(b.is_featured) - Number(a.is_featured) ||
      compareText(a.name, b.name),
  );

  const companies: Company[] = sortedRows.map((row) => ({
    slug: row.slug,
    name: row.name,
    description: row.description,
    websiteUrl: row.website_url,
    careersUrl: row.careers_url,
    githubUrl: row.github_url,
    categories: row.categories,
    locations: row.locations,
    isFeatured: row.is_featured,
    logoUrl: row.logo_url ?? undefined,
  }));

  const availableCategories = Array.from(
    new Set(rows.flatMap((row) => row.categories)),
  ).sort(compareText);

  const availableLocations = Array.from(
    new Set(rows.flatMap((row) => row.locations)),
  ).sort(compareText);

  const latestUpdate = rows.reduce<string | undefined>(
    (latest, row) =>
      !latest || Date.parse(row.updated_at) > Date.parse(latest)
        ? row.updated_at
        : latest,
    undefined,
  );

  return {
    companies,
    availableCategories,
    availableLocations,
    updatedAtISODate: latestUpdate
      ? new Date(latestUpdate).toISOString()
      : undefined,
  };
};
