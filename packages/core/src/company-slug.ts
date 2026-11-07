import slugify from "slugify";

const toSlug = (value: string) => slugify(value, { lower: true, strict: true });

/** The slug rule behind `/company/[slug]`; README and manual companies share it. */
export const toCompanySlug = (name: string) => toSlug(name);

/**
 * Category and location slugs (`fintech`, `sao-joao-da-madeira`), as the public
 * API filters on them. Site category URLs must use it too once they move to
 * slugs, or links between the two break.
 */
export const toFilterSlug = (name: string) => toSlug(name);
