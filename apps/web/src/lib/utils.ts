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

  const matchesQuery = !query || searchTerm.includes(query.toLowerCase());

  const matchesCategory =
    !category ||
    category === "all" ||
    (Array.isArray(company?.categories)
      ? company.categories.includes(category)
      : company.categories === category);

  const matchesLocation =
    !location ||
    location === "all" ||
    (Array.isArray(company?.locations)
      ? company.locations.includes(location)
      : company.locations === location);

  return matchesQuery && matchesCategory && matchesLocation;
};

export const isProd = process.env.NODE_ENV === "production";

export const PUBLIC_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export const normalizeText = (text: string) => {
  // this will remove all special characters and spaces
  return text.replace(/[^a-zA-Z0-9\s]/g, "");
};
