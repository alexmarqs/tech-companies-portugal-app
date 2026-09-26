import { unstable_cache } from "next/cache";
import { cache } from "react";
import { buildCompaniesCatalogue } from "../companies-catalogue";
import { getListedCompanyRows } from "../db/companies";
import { getShowcaseSeed, pickShowcaseCompanies } from "../showcase";

export const COMPANIES_DATA_TAG = "companies-data";

/**
 * The shared company accessor. Reads the `companies` table (kept in sync
 * with the README by the `sync-companies` workflow) and returns the same
 * shape the README parser used to, so every reader migrates at once.
 *
 * Throws on an empty table rather than caching and rendering an empty
 * directory for a day.
 */
export const getParsedCompaniesData = cache(
  unstable_cache(
    async () => {
      const rows = await getListedCompanyRows();

      if (rows.length === 0) {
        throw new Error("No companies found in the database");
      }

      return buildCompaniesCatalogue(rows);
    },
    ["companies-db"],
    { revalidate: 86400, tags: [COMPANIES_DATA_TAG] }, // 1 day
  ),
);

export const getParsedCompaniesCategoriesAndLocations = async () => {
  const { availableCategories, availableLocations } =
    await getParsedCompaniesData();
  return { availableCategories, availableLocations };
};

export const getParsedCompanyBySlug = async (slug: string) => {
  const { companies } = await getParsedCompaniesData();

  return companies.find((company) => company.slug === slug);
};

export const getCompaniesOverview = async () => {
  const { companies, availableCategories, availableLocations } =
    await getParsedCompaniesData();

  return {
    showcaseCompanies: pickShowcaseCompanies(companies, getShowcaseSeed()),
    totalCompanies: companies.length,
    totalCategories: availableCategories.length,
    totalLocations: availableLocations.length,
  };
};
