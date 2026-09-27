import "server-only";

import { createAdminClient } from "@tech-companies-portugal/supabase/server";
import {
  COMPANY_ROW_COLUMNS,
  type CompanyRow,
} from "../../companies-catalogue";
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

/** Every company row, archived ones included — the import diffs against all. */
export const getAllCompanyRowsForImport = async (): Promise<
  ExistingCompany[]
> => {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("companies")
    .select(
      "slug, name, description, website_url, careers_url, github_url, categories, locations, logo_url, is_featured, archived_at",
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
