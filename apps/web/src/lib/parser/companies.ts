import { parseCompaniesData } from "../parser";

export const getParsedCompaniesData = async () => {
  const { data, timestamp } = await parseCompaniesData();

  // sort data.companies by isFeatured first
  data.companies.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  return {
    companies: data.companies,
    availableLocations: data.availableLocations,
    availableCategories: data.availableCategories,
    updatedAtISODate: timestamp,
  };
};

export const getParsedCompaniesCategoriesAndLocations = async () => {
  const { data } = await parseCompaniesData();
  return {
    availableCategories: data.availableCategories,
    availableLocations: data.availableLocations,
  };
};

export const getParsedCompanyBySlug = async (slug: string) => {
  const { companies } = await getParsedCompaniesData();

  return companies.find((company) => company.slug === slug);
};
