import { unstable_cache } from "next/cache";
import { cache } from "react";
import { buildCompaniesCatalog } from "../companies-catalog";
import { COMPANIES_DATA_TAG } from "../constants";
import { getListedCompanyRows } from "./db/companies";

/**
 * The shared company accessor. Reads the `companies` table (kept in sync
 * with the README by the `sync-companies` workflow) and returns the same
 * shape the README parser used to, so every reader migrates at once.
 *
 * Throws on an empty table rather than caching and rendering an empty
 * directory for a day.
 */
export const getParsedCompaniesData = cache(
  unstable_cache(
    async () => {
      const rows = await getListedCompanyRows();

      if (rows.length === 0) {
        throw new Error("No companies found in the database");
      }

      return buildCompaniesCatalog(rows);
    },
    ["companies-db"],
    { revalidate: 86400, tags: [COMPANIES_DATA_TAG] }, // 1 day
  ),
);
