import { unstable_cache } from "next/cache";
import { cache } from "react";
import { hydrateCompaniesWithLogos } from "../logos";
import { parseCompaniesData } from "../parser";

export const getParsedCompaniesData = cache(
  unstable_cache(
    async () => {
      const { data, timestamp } = await parseCompaniesData();

      // sort data.companies by isFeatured first
      data.companies.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });

      const companiesWithLogos = await hydrateCompaniesWithLogos(
        data.companies,
      );

      return {
        companies: companiesWithLogos,
        availableLocations: data.availableLocations,
        availableCategories: data.availableCategories,
        updatedAtISODate: timestamp,
      };
    },
    ["companies-with-logos"],
    { revalidate: 86400, tags: ["companies-data"] },
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
  const { companies } = await getParsedCompaniesData();
  const firstCompaniesLogos = companies
    .slice(0, 5)
    .map((company) => company.logoUrl)
    .filter(Boolean);
  const totalMoreCompanies = companies.length - firstCompaniesLogos.length;

  return { firstCompaniesLogos, totalMoreCompanies };
};
