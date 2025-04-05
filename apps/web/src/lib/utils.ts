import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Company } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const matchCompanies = (
  company: Company,
  query: string,
  category: string,
  location: string,
) => {
  const searchTerm = `${company.name} ${company.description}`.toLowerCase();
  return (
    (!query || searchTerm.includes(query.toLowerCase())) &&
    (!category || Array.isArray(company?.categories)
      ? company.categories.includes(category)
      : company.categories === category) &&
    (!location || company?.locations?.includes(location))
  );
};
