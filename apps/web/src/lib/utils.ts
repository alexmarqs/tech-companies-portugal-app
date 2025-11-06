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

  const match =
    ((!query || searchTerm.includes(query.toLowerCase())) && !category) ||
    category === "all" ||
    ((Array.isArray(company?.categories)
      ? company.categories.includes(category)
      : company.categories === category) &&
      !location) ||
    location === "all" ||
    (Array.isArray(company?.locations)
      ? company.locations.includes(location)
      : company.locations === location);

  return match;
};
