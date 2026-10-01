import {
  COMPANIES_DATA_TAG,
  CompanyImportGuardError,
  type CompanyImportPlan,
  type ImportedCompany,
  type InvalidCompany,
  normalizeReadmeCompanies,
  planCompanyImport,
} from "@tech-companies-portugal/core";
import {
  archiveCompanies,
  getAllCompanyRowsForImport,
  hydrateCompaniesWithLogos,
  parseCompaniesData,
  upsertCompanies,
} from "@tech-companies-portugal/core/server";
import { revalidateTag } from "next/cache";
import { FatalError } from "workflow";

type ReadmeCompanies = {
  companies: ImportedCompany[];
  invalid: InvalidCompany[];
};

export type SyncCompaniesWorkflowResult = {
  status: "no-changes" | "applied";
  total: number;
  added: string[];
  changed: CompanyImportPlan["changed"];
  restored: string[];
  archived: string[];
  unchanged: number;
  invalid: InvalidCompany[];
};

/**
 * Workflow to sync the companies from the README to the database.
 */
export async function syncCompaniesWorkflow(): Promise<SyncCompaniesWorkflowResult> {
  "use workflow";

  // Step 1: Fetch the companies from the README
  const githubRepoCompanies = await fetchGithubReadmeCompanies();

  // Step 2: Hydrate the companies with logos
  const companies = await hydrateLogos(githubRepoCompanies.companies);

  // Step 3: Apply the companies import
  const result = await applyCompaniesImport(
    companies,
    githubRepoCompanies.invalid,
  );

  // Step 4: Revalidate the companies data
  if (result.status === "applied") {
    await revalidateCompaniesData();
  }

  return result;
}

async function fetchGithubReadmeCompanies(): Promise<ReadmeCompanies> {
  "use step";

  const { data } = await parseCompaniesData();

  const { companies, invalid, duplicates } = normalizeReadmeCompanies(
    data.companies,
  );

  console.log(
    `[sync-companies] parsed ${data.companies.length} README rows → ${companies.length} companies`,
  );

  if (duplicates.length > 0) {
    console.log(
      `[sync-companies] merged duplicate rows: ${duplicates.join(", ")}`,
    );
  }

  for (const company of invalid) {
    console.warn(
      `[sync-companies] skipped invalid row "${company.name}" (${company.slug || "no slug"}): ${company.reason}`,
    );
  }

  return { companies, invalid };
}

async function hydrateLogos(
  companies: ImportedCompany[],
): Promise<ImportedCompany[]> {
  "use step";

  return hydrateCompaniesWithLogos(companies);
}

/**
 * Reads, plans and writes in one step so a retry re-plans against the
 * table's current state. Both writes are idempotent.
 */
async function applyCompaniesImport(
  companies: ImportedCompany[],
  invalid: InvalidCompany[],
): Promise<SyncCompaniesWorkflowResult> {
  "use step";

  const existing = await getAllCompanyRowsForImport();

  let plan: CompanyImportPlan;

  try {
    plan = planCompanyImport({
      existing,
      incoming: companies,
      protectedSlugs: invalid.map((company) => company.slug).filter(Boolean),
    });
  } catch (error) {
    if (error instanceof CompanyImportGuardError) {
      console.error(`[sync-companies] ${error.message}`);
      throw new FatalError(error.message);
    }

    throw error;
  }

  // Upsert the companies
  await upsertCompanies(plan.upserts);

  // Archive the companies, e.g. if they are no longer in the README etc.
  await archiveCompanies(plan.archiveSlugs);

  const result: SyncCompaniesWorkflowResult = {
    status:
      plan.upserts.length > 0 || plan.archiveSlugs.length > 0
        ? "applied"
        : "no-changes",
    total: companies.length,
    added: plan.added,
    changed: plan.changed,
    restored: plan.restored,
    archived: plan.archiveSlugs,
    unchanged: plan.unchanged,
    invalid,
  };

  console.log(
    `[sync-companies] added=${plan.added.length} changed=${plan.changed.length} restored=${plan.restored.length} archived=${plan.archiveSlugs.length} unchanged=${plan.unchanged} invalid=${invalid.length}`,
  );

  for (const slug of plan.added) {
    console.log(`[sync-companies] added ${slug}`);
  }

  for (const { slug, fields } of plan.changed) {
    console.log(`[sync-companies] changed ${slug}: ${fields.join(", ")}`);
  }

  for (const slug of plan.restored) {
    console.log(`[sync-companies] restored ${slug}`);
  }

  for (const slug of plan.archiveSlugs) {
    console.log(`[sync-companies] archived ${slug}`);
  }

  return result;
}

/**
 * Expires the company accessor's cache so the change shows on the next
 * request instead of within the 24h revalidation window.
 */
async function revalidateCompaniesData(): Promise<void> {
  "use step";

  revalidateTag(COMPANIES_DATA_TAG, { expire: 0 });

  console.log(`[sync-companies] revalidated tag ${COMPANIES_DATA_TAG}`);
}
