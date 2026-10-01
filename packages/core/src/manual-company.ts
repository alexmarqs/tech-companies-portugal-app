import {
  type ImportedCompany,
  normalizeReadmeCompanies,
} from "./company-import";
import { toCompanySlug } from "./company-slug";

/** A company the maintainer adds by hand (`create-manual-company` input). */
export type ManualCompanyEntry = {
  name: string;
  websiteUrl: string;
  description: string;
  categories: string[];
  locations: string[];
  careersUrl?: string;
  githubUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
};

export type PreparedManualCompany = ImportedCompany & {
  instagramUrl: string;
  facebookUrl: string;
};

export type PrepareManualCompanyResult =
  | { ok: true; company: PreparedManualCompany }
  | { ok: false; reason: string };

/**
 * Validates a manual entry with the same rules as README rows (plus a
 * required description and social link hosts) and refuses slugs already in
 * the table, whatever their source. Pure: the script does the I/O.
 */
export const prepareManualCompany = (
  entry: ManualCompanyEntry,
  existingSlugs: ReadonlySet<string>,
): PrepareManualCompanyResult => {
  const name = entry.name ?? "";

  const { companies, invalid } = normalizeReadmeCompanies([
    {
      slug: toCompanySlug(name.trim()),
      name,
      description: entry.description ?? "",
      websiteUrl: entry.websiteUrl ?? "",
      careersUrl: entry.careersUrl ?? "",
      githubUrl: entry.githubUrl ?? "",
      categories: entry.categories ?? [],
      locations: entry.locations ?? [],
      isFeatured: false,
    },
  ]);

  const [invalidEntry] = invalid;
  if (invalidEntry) return { ok: false, reason: invalidEntry.reason };

  const [company] = companies;
  if (!company) return { ok: false, reason: "invalid entry" };

  if (!company.description) {
    return { ok: false, reason: "missing description" };
  }

  const instagramUrl = (entry.instagramUrl ?? "").trim();
  if (instagramUrl && !isUrlOnHost(instagramUrl, "instagram.com")) {
    return { ok: false, reason: "instagramUrl must be an instagram.com URL" };
  }

  const facebookUrl = (entry.facebookUrl ?? "").trim();
  if (facebookUrl && !isUrlOnHost(facebookUrl, "facebook.com")) {
    return { ok: false, reason: "facebookUrl must be a facebook.com URL" };
  }

  if (existingSlugs.has(company.slug)) {
    return { ok: false, reason: `slug "${company.slug}" already exists` };
  }

  return { ok: true, company: { ...company, instagramUrl, facebookUrl } };
};

const isUrlOnHost = (value: string, host: string) => {
  try {
    const { protocol, hostname } = new URL(value);
    return (
      (protocol === "https:" || protocol === "http:") &&
      (hostname === host || hostname.endsWith(`.${host}`))
    );
  } catch {
    return false;
  }
};
