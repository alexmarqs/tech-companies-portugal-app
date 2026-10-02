import slugify from "slugify";

/** The slug rule behind `/company/[slug]`; README and manual companies share it. */
export const toCompanySlug = (name: string) =>
  slugify(name, { lower: true, strict: true });
