import type { Company } from "./types";

function normalizeCategories(categories: string[] | string): string[] {
  return Array.isArray(categories) ? categories : [categories];
}

const MAX_RELATED_COMPANIES = 6;

/**
 * Get related companies based on the current company's categories and locations.
 * Scoring: +3 per shared category and +2 per shared location.
 */
export function getRelatedCompanies(
  currentCompany: Company,
  allCompanies: Company[],
  limit = MAX_RELATED_COMPANIES,
): Company[] {
  const currentCategories = normalizeCategories(currentCompany.categories);
  const currentLocations = new Set(currentCompany.locations);
  const currentCategorySet = new Set(currentCategories);

  const scored = allCompanies
    .filter((c) => c.slug !== currentCompany.slug)
    .map((company) => {
      let score = 0;

      for (const loc of company.locations) {
        if (currentLocations.has(loc)) score += 2;
      }

      const companyCategories = normalizeCategories(company.categories);
      for (const cat of companyCategories) {
        if (currentCategorySet.has(cat)) score += 3;
      }

      return { company, score };
    })
    .filter(({ score }) => score > 0);

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.company.name.localeCompare(b.company.name);
  });

  return scored.slice(0, limit).map(({ company }) => company);
}
