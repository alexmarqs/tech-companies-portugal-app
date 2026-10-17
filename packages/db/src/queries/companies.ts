import type { DbClient, Tables, TablesInsert } from "../types";

/** What the site renders from: `buildCompaniesCatalog` maps these. */
export type CompanyRow = Pick<
  Tables<"companies">,
  | "slug"
  | "name"
  | "description"
  | "website_url"
  | "careers_url"
  | "github_url"
  | "instagram_url"
  | "facebook_url"
  | "categories"
  | "locations"
  | "logo_url"
  | "is_featured"
  | "updated_at"
>;

const COMPANY_ROW_COLUMNS =
  "slug, name, description, website_url, careers_url, github_url, instagram_url, facebook_url, categories, locations, logo_url, is_featured, updated_at";

/** What the README import diffs against (`planCompanyImport`). */
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
  | "source"
>;

const EXISTING_COMPANY_COLUMNS =
  "slug, name, description, website_url, careers_url, github_url, categories, locations, logo_url, is_featured, archived_at, source";

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

/** Listed (non-archived) companies; `buildCompaniesCatalog` orders them. */
export const getListedCompanyRows = async (
  supabase: DbClient,
): Promise<CompanyRow[]> => {
  const { data, error } = await supabase
    .from("companies")
    .select(COMPANY_ROW_COLUMNS)
    .is("archived_at", null);

  if (error) {
    console.error("Error fetching companies", error);
    throw error;
  }

  return data;
};

/**
 * Listed companies first added after `since`, oldest first. `created_at` is
 * set once on insert, so archived-then-restored companies are not "new".
 */
export const getListedCompaniesCreatedAfter = async (
  supabase: DbClient,
  since: string,
): Promise<{ slug: string; name: string }[]> => {
  const { data, error } = await supabase
    .from("companies")
    .select("slug, name")
    .is("archived_at", null)
    .gt("created_at", since)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching newly added companies", error);
    throw error;
  }

  return data;
};

/**
 * Every company row, archived and non-README ones included — the import
 * diffs against all of them and decides which it owns by `source`.
 */
export const getAllCompanyRowsForImport = async (
  supabase: DbClient,
): Promise<ExistingCompany[]> => {
  const { data, error } = await supabase
    .from("companies")
    .select(EXISTING_COMPANY_COLUMNS);

  if (error) {
    console.error("Error fetching companies for import", error);
    throw error;
  }

  return data;
};

/** Every slug in the table, archived and any source included. */
export const getAllCompanySlugs = async (
  supabase: DbClient,
): Promise<Set<string>> => {
  const { data, error } = await supabase.from("companies").select("slug");

  if (error) {
    console.error("Error fetching company slugs", error);
    throw error;
  }

  return new Set(data.map((row) => row.slug));
};

/** Fails on a duplicate slug (unique constraint) rather than overwriting. */
export const insertCompany = async (
  supabase: DbClient,
  company: TablesInsert<"companies">,
): Promise<{ slug: string; created_at: string }> => {
  const { data, error } = await supabase
    .from("companies")
    .insert(company)
    .select("slug, created_at")
    .single();

  if (error) {
    console.error("Error inserting company", error);
    throw error;
  }

  return data;
};

export const upsertCompanies = async (
  supabase: DbClient,
  rows: CompanyUpsert[],
) => {
  if (rows.length === 0) return;

  const { error } = await supabase
    .from("companies")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Error upserting companies", error);
    throw error;
  }
};

/**
 * Soft delete: `archived_at` hides a company instead of deleting the row, so
 * one that comes back to the README is restored with its original `id` and
 * `created_at` (and is not re-announced by the weekly digest).
 *
 * - Admin UI (later): archive first, hard-delete only archived rows. While the
 *   README sync runs it restores/re-inserts anything still in the README, so
 *   admin archives would need an `archived_reason` (or the sync turned off).
 * - Index: none needed at this size (a seq scan is cheaper). At tens of
 *   thousands of rows, add a partial index on `(created_at) where
 *   archived_at is null` for the digest query.
 */
export const archiveCompanies = async (supabase: DbClient, slugs: string[]) => {
  if (slugs.length === 0) return;

  const { error } = await supabase
    .from("companies")
    .update({ archived_at: new Date().toISOString() })
    .in("slug", slugs)
    .is("archived_at", null);

  if (error) {
    console.error("Error archiving companies", error);
    throw error;
  }
};
