import { getParsedCompaniesData } from "@tech-companies-portugal/core/server";
import { getShowcaseSeed, pickShowcaseCompanies } from "../showcase";

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
