import "server-only";

import { createAdminClient } from "@tech-companies-portugal/supabase/server";
import { COMPANY_ROW_COLUMNS, type CompanyRow } from "../../companies-catalog";
import type { CompanyUpsert, ExistingCompany } from "../../company-import";

/** Listed (non-archived) companies; `buildCompaniesCatalogue` orders them. */
export const getListedCompanyRows = async (): Promise<CompanyRow[]> => {
  const supabase = await createAdminClient();

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
  since: string,
): Promise<{ slug: string; name: string }[]> => {
  const supabase = await createAdminClient();

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
export const getAllCompanyRowsForImport = async (): Promise<
  ExistingCompany[]
> => {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("companies")
    .select(
      "slug, name, description, website_url, careers_url, github_url, categories, locations, logo_url, is_featured, archived_at, source",
    );

  if (error) {
    console.error("Error fetching companies for import", error);
    throw error;
  }

  return data;
};

export const upsertCompanies = async (rows: CompanyUpsert[]) => {
  if (rows.length === 0) return;

  const supabase = await createAdminClient();

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
export const archiveCompanies = async (slugs: string[]) => {
  if (slugs.length === 0) return;

  const supabase = await createAdminClient();

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
