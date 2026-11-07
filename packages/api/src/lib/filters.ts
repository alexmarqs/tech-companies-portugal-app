import { normalizeText, toFilterSlug } from "@tech-companies-portugal/core";

export interface FilterDefinition {
  companyCount: number;
  name: string;
  slug: string;
}

/**
 * One definition per slug, counting each company once. Slug order. Names that
 * share a slug ("E-commerce 🛍️" / "E-commerce 🛒", README typos) are merged
 * under the first name seen, matching how filtering compares slugs.
 */
export const buildFilterDefinitions = (
  values: string[][],
): FilterDefinition[] => {
  const bySlug = new Map<
    string,
    { companyCount: number; sourceName: string }
  >();

  for (const companyValues of values) {
    const slugs = new Map<string, string>();
    for (const sourceName of companyValues) {
      const slug = toFilterSlug(sourceName);
      if (slug && !slugs.has(slug)) slugs.set(slug, sourceName);
    }

    for (const [slug, sourceName] of slugs) {
      const existing = bySlug.get(slug);
      bySlug.set(slug, {
        companyCount: (existing?.companyCount ?? 0) + 1,
        sourceName: existing?.sourceName ?? sourceName,
      });
    }
  }

  return [...bySlug.entries()]
    .map(([slug, value]) => ({
      slug,
      name: normalizeText(value.sourceName),
      companyCount: value.companyCount,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug, "en"));
};
