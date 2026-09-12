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

// Category names arrive from the source README with a trailing emoji
// ("Automotive 🚘"). Strip the pictographs wherever the name has to read as
// prose — titles, headings, meta descriptions — while leaving real punctuation
// intact, so "E-commerce 🛍️" stays "E-commerce", not "Ecommerce".
export const normalizeText = (text: string) =>
  text
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, "")
    .replace(/\s+/g, " ")
    .trim();

// Category names are the raw README strings, emoji and all, so the route param
// arrives percent-encoded.
// TODO: this goes away once categories move to proper SEO slugs (ASCII, no
// emoji in the URL) instead of the raw category name.
export const decodeCategoryParam = (categoryParam: string) =>
  decodeURIComponent(categoryParam).replace(/\s+/g, " ").trim();
