import type { Company } from "./types";

export type ShowcaseCompany = {
  slug: string;
  name: string;
  logoUrl: string;
  isFeatured?: true;
};

const DEFAULT_SIZE_SHOWCASE = 16; // 16 companies
const MS_PER_DAY = 86_400_000; // 1 day

/**
 * Days since the Unix epoch (UTC). Everyone who loads the page on the same day
 * gets the same pile, and it rotates in step with the 1-day companies cache.
 */
export const getShowcaseSeed = (date: Date = new Date()) =>
  Math.floor(date.getTime() / MS_PER_DAY);

// mulberry32: tiny seeded PRNG, plenty for shuffling a few hundred entries.
const createRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const toShowcaseCompany = (company: Company): ShowcaseCompany | null => {
  if (!company.logoUrl) return null;

  return {
    slug: company.slug,
    name: company.name,
    logoUrl: company.logoUrl,
    ...(company.isFeatured && { isFeatured: true }),
  };
};

/**
 * Featured companies lead; the remaining slots are a seeded shuffle of every
 * company that has a logo to show.
 */
export const pickShowcaseCompanies = (
  companies: Company[],
  seed: number,
  size = DEFAULT_SIZE_SHOWCASE,
): ShowcaseCompany[] => {
  const featured: ShowcaseCompany[] = [];
  const rest: ShowcaseCompany[] = [];

  for (const company of companies) {
    const entry = toShowcaseCompany(company);
    if (!entry) continue;
    (company.isFeatured ? featured : rest).push(entry);
  }

  const random = createRandom(seed);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [rest[i], rest[j]] = [rest[j]!, rest[i]!];
  }

  return [...featured, ...rest].slice(0, size);
};
