import slugify from "slugify";

export interface FilterDefinition {
  companyCount: number;
  name: string;
  slug: string;
}

export const toFilterSlug = (value: string) =>
  slugify(value, { lower: true, strict: true });

export const toFilterName = (value: string) =>
  value
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, "")
    .replace(/\s+/g, " ")
    .trim();

/** One definition per slug, counting each company once. Slug order. */
export const buildFilterDefinitions = (
  values: string[][],
): FilterDefinition[] => {
  const bySlug = new Map<
    string,
    { companyCount: number; sourceName: string }
  >();

  for (const companyValues of values) {
    for (const sourceName of new Set(companyValues)) {
      const slug = toFilterSlug(sourceName);
      if (!slug) continue;

      const existing = bySlug.get(slug);
      if (existing && existing.sourceName !== sourceName) {
        throw new Error(
          `Filter slug collision: "${existing.sourceName}" and "${sourceName}" both resolve to "${slug}".`,
        );
      }

      bySlug.set(slug, {
        companyCount: (existing?.companyCount ?? 0) + 1,
        sourceName,
      });
    }
  }

  return [...bySlug.entries()]
    .map(([slug, value]) => ({
      slug,
      name: toFilterName(value.sourceName),
      companyCount: value.companyCount,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug, "en"));
};
