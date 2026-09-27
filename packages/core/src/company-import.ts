import type {
  Tables,
  TablesInsert,
} from "@tech-companies-portugal/supabase/types";
import type { Company } from "./types";

/**
 * Pure planning for the README → `companies` import. No I/O here, so the
 * rules (merge, validate, diff, guard) are unit-testable; the
 * `sync-companies` workflow does the fetching and writing.
 */

export type ImportedCompany = Omit<Company, "categories"> & {
  categories: string[];
};

export type InvalidCompany = {
  slug: string;
  name: string;
  reason: string;
};

export type ExistingCompany = Pick<
  Tables<"companies">,
  | "slug"
  | "name"
  | "description"
  | "website_url"
  | "careers_url"
  | "github_url"
  | "categories"
  | "locations"
  | "logo_url"
  | "is_featured"
  | "archived_at"
>;

export type CompanyUpsert = TablesInsert<"companies"> &
  Pick<
    Tables<"companies">,
    | "name"
    | "description"
    | "website_url"
    | "careers_url"
    | "github_url"
    | "categories"
    | "locations"
    | "logo_url"
    | "is_featured"
    | "archived_at"
  >;

export type CompanyImportPlan = {
  upserts: CompanyUpsert[];
  archiveSlugs: string[];
  added: string[];
  changed: { slug: string; fields: string[] }[];
  restored: string[];
  unchanged: number;
};

export class CompanyImportGuardError extends Error {
  name = "CompanyImportGuardError";
}

/**
 * Collapses README rows into one entry per slug and drops rows that cannot be
 * rendered. The README can list a company under several categories (e.g.
 * RevenueCat under Developer Tools and FinTech); those become one company
 * with both categories, keeping the first row's details.
 */
export const normalizeReadmeCompanies = (companies: Company[]) => {
  const bySlug = new Map<string, ImportedCompany>();
  const invalid: InvalidCompany[] = [];
  const duplicates = new Set<string>();

  for (const company of companies) {
    const candidate: ImportedCompany = {
      ...company,
      slug: company.slug.trim(),
      name: company.name.trim(),
      description: company.description.trim(),
      websiteUrl: company.websiteUrl.trim(),
      careersUrl: company.careersUrl.trim(),
      githubUrl: company.githubUrl.trim(),
      categories: toUniqueList(
        Array.isArray(company.categories)
          ? company.categories
          : [company.categories],
      ),
      locations: toUniqueList(company.locations),
    };

    const reason = getInvalidReason(candidate);

    if (reason) {
      invalid.push({ slug: candidate.slug, name: candidate.name, reason });
      continue;
    }

    const existing = bySlug.get(candidate.slug);

    if (!existing) {
      bySlug.set(candidate.slug, candidate);
      continue;
    }

    duplicates.add(candidate.slug);
    bySlug.set(candidate.slug, {
      ...existing,
      description: existing.description || candidate.description,
      careersUrl: existing.careersUrl || candidate.careersUrl,
      githubUrl: existing.githubUrl || candidate.githubUrl,
      categories: toUniqueList([
        ...existing.categories,
        ...candidate.categories,
      ]),
      locations: toUniqueList([...existing.locations, ...candidate.locations]),
      isFeatured: existing.isFeatured || candidate.isFeatured,
    });
  }

  return {
    companies: Array.from(bySlug.values()),
    invalid,
    duplicates: Array.from(duplicates),
  };
};

const getInvalidReason = (company: ImportedCompany) => {
  if (!company.name) return "missing name";
  if (!company.slug) return "missing slug";
  if (!isHttpUrl(company.websiteUrl)) return "invalid website URL";
  if (company.categories.length === 0) return "missing category";
  if (company.locations.length === 0) return "missing location";
  return null;
};

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const toUniqueList = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

/**
 * Diffs the import against the table.
 *
 * - New slugs are inserted; `is_featured` is only seeded on insert, after
 *   that the database owns it.
 * - A missing logo never clears a stored one (logo.dev or Redis may just be
 *   unavailable this run).
 * - Companies that left the README are archived, never deleted. Slugs in
 *   `protectedSlugs` (rows that failed validation this run) are not archived:
 *   a malformed row is not a removal.
 * - Refuses implausible imports instead of applying them: an empty import, or
 *   one that would archive more than `maxArchiveRatio` of listed companies,
 *   is far more likely a broken fetch or a README markup change.
 */
export const planCompanyImport = ({
  existing,
  incoming,
  protectedSlugs = [],
  maxArchiveRatio = 0.1,
  minArchiveLimit = 10,
}: {
  existing: ExistingCompany[];
  incoming: ImportedCompany[];
  protectedSlugs?: string[];
  maxArchiveRatio?: number;
  minArchiveLimit?: number;
}): CompanyImportPlan => {
  if (incoming.length === 0) {
    throw new CompanyImportGuardError(
      "Import contains zero companies — refusing to apply it",
    );
  }

  const existingBySlug = new Map(existing.map((row) => [row.slug, row]));
  const incomingSlugs = new Set(incoming.map((company) => company.slug));
  const keepSlugs = new Set(protectedSlugs);

  const plan: CompanyImportPlan = {
    upserts: [],
    archiveSlugs: [],
    added: [],
    changed: [],
    restored: [],
    unchanged: 0,
  };

  for (const company of incoming) {
    const current = existingBySlug.get(company.slug);

    const next: CompanyUpsert = {
      slug: company.slug,
      name: company.name,
      description: company.description,
      website_url: company.websiteUrl,
      careers_url: company.careersUrl,
      github_url: company.githubUrl,
      categories: company.categories,
      locations: company.locations,
      logo_url: company.logoUrl ?? current?.logo_url ?? null,
      is_featured: current ? current.is_featured : Boolean(company.isFeatured),
      archived_at: null,
    };

    if (!current) {
      plan.added.push(company.slug);
      plan.upserts.push(next);
      continue;
    }

    const fields = CONTENT_FIELDS.filter(
      (field) => !isEqualValue(current[field], next[field]),
    );
    const isRestored = current.archived_at !== null;

    if (fields.length === 0 && !isRestored) {
      plan.unchanged += 1;
      continue;
    }

    if (isRestored) plan.restored.push(company.slug);
    if (fields.length > 0) plan.changed.push({ slug: company.slug, fields });

    plan.upserts.push(next);
  }

  plan.archiveSlugs = existing
    .filter(
      (row) =>
        row.archived_at === null &&
        !incomingSlugs.has(row.slug) &&
        !keepSlugs.has(row.slug),
    )
    .map((row) => row.slug);

  const listedCount = existing.filter((row) => row.archived_at === null).length;
  const archiveLimit = Math.max(
    minArchiveLimit,
    Math.floor(listedCount * maxArchiveRatio),
  );

  if (plan.archiveSlugs.length > archiveLimit) {
    throw new CompanyImportGuardError(
      `Import would archive ${plan.archiveSlugs.length} of ${listedCount} listed companies (limit ${archiveLimit}) — refusing to apply it`,
    );
  }

  return plan;
};

const CONTENT_FIELDS = [
  "name",
  "description",
  "website_url",
  "careers_url",
  "github_url",
  "categories",
  "locations",
  "logo_url",
] as const satisfies (keyof ExistingCompany & keyof CompanyUpsert)[];

const isEqualValue = (a: unknown, b: unknown) =>
  Array.isArray(a) && Array.isArray(b)
    ? a.length === b.length && a.every((value, index) => value === b[index])
    : a === b;
