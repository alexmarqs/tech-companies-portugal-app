import { type Company, getCategoryList } from "@tech-companies-portugal/core";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
    getCategoryList(company.categories).includes(category);

  const matchesLocation =
    !location ||
    location === "all" ||
    (Array.isArray(company?.locations)
      ? company.locations.includes(location)
      : company.locations === location);

  return matchesQuery && matchesCategory && matchesLocation;
};

export const PUBLIC_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

// Category names are the raw README strings, emoji and all, so the route param
// arrives percent-encoded.
// TODO: this goes away once categories move to proper SEO slugs (ASCII, no
// emoji in the URL) instead of the raw category name.
export const decodeCategoryParam = (categoryParam: string) =>
  decodeURIComponent(categoryParam).replace(/\s+/g, " ").trim();
