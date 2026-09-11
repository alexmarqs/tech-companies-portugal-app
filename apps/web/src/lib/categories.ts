import type { HeadingParts } from "./types";
import { normalizeText } from "./utils";

// "FinTech Tech Companies" stutters, so categories that already carry the word
// drop it from the generated copy.
const alreadySaysTech = (name: string) => /tech/i.test(name);

const suffix = (name: string) =>
  alreadySaysTech(name) ? "Companies" : "Tech Companies";

/** Name and surrounding words separately, so the name can be tinted. */
export const categoryHeadingParts = (category: string): HeadingParts => {
  const name = normalizeText(category);

  return { lead: "", name, trail: suffix(name) };
};

export const categoryPageTitle = (category: string) => {
  const name = normalizeText(category);

  return `${name} ${suffix(name)} in Portugal`;
};

/** The heading sits under a breadcrumb, so it leaves "in Portugal" to the title. */
export const categoryPageHeading = (category: string) => {
  const name = normalizeText(category);

  return `${name} ${suffix(name)}`;
};

export const categoryPageDescription = (category: string) =>
  `Browse tech companies in Portugal working in ${normalizeText(category)}. Compare startups, scaleups, and global employers by location.`;
