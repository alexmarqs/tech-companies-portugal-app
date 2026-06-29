"use client";

import { LABELS_FILTER } from "@/lib/search-params";
import type { Company } from "@/lib/types";
import { matchCompanies } from "@/lib/utils";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import CompaniesListPagination from "./CompaniesListPagination";
import CompanyItem from "./CompanyItem";
import { EmptyState } from "./EmptyState";
import { NotificationsSideSection } from "./NotificationsSideSection";

const PAGE_SIZE = 12;
const DIGEST_CELL = "weekly-digest" as const;

type CompaniesListProps = {
  allCompanies: Company[];
  isDedicatedPage?: boolean;
};

export default function CompaniesList({
  allCompanies,
  isDedicatedPage = false,
}: CompaniesListProps) {
  //const [view, setView] = useState<"grid" | "list">("grid");
  const {
    searchParams: { query, category, location, page },
    appliedFilters,
    setSearchParams,
  } = useSearchQueryParams();

  const filteredCompanies = useMemo(
    () =>
      isDedicatedPage
        ? allCompanies
        : allCompanies.filter((company) =>
            matchCompanies(company, query, category, location),
          ),
    [allCompanies, query, category, location, isDedicatedPage],
  );

  const start = (page - 1) * PAGE_SIZE;
  const paginatedCompanies = filteredCompanies.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);

  // The weekly-digest promo is a full-width band woven between grid rows on the
  // first page. It spans every column, so it never steals a company slot or
  // leaves an orphaned card — page size stays a clean 12 companies per page.
  const showDigest =
    !isDedicatedPage && page === 1 && paginatedCompanies.length > 0;
  const gridItems = paginatedCompanies.map((company) => (
    <CompanyItem key={company.slug} company={company} />
  ));
  if (showDigest) {
    // show the digest section after 6 companies on the first page
    gridItems.splice(
      Math.min(6, gridItems.length),
      0,
      <NotificationsSideSection
        key={DIGEST_CELL}
        className="md:col-span-2 lg:col-span-3"
      />,
    );
  }

  return (
    <>
      <div className="flex-1">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {isDedicatedPage && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              View all companies
            </Link>
          )}

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {appliedFilters.some(([key]) => key !== "query") && (
              <div className="flex flex-wrap gap-2">
                {appliedFilters
                  .filter(([key]) => key !== "query")
                  .map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSearchParams({ [key]: null, page: 1 });
                      }}
                      aria-label={`Remove ${LABELS_FILTER[key] || key} filter`}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium shadow-sm transition-colors hover:border-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <span className="text-muted-foreground">
                        {LABELS_FILTER[key] || key}:
                      </span>
                      <span className="max-w-[180px] truncate text-foreground">
                        {value}
                      </span>
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-foreground/10 group-hover:text-foreground">
                        <X className="h-3 w-3" />
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>
          {filteredCompanies.length > 0 && (
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums mr-2">
              Showing {start + 1}–{start + paginatedCompanies.length} of{" "}
              {filteredCompanies.length}
            </span>
          )}
        </div>
        {!paginatedCompanies.length ? (
          <div className="flex-1 flex flex-col items-center text-muted-foreground justify-center gap-4 min-h-[300px] border border-border/60 rounded-xl p-6 bg-muted/20">
            <EmptyState title="No companies match your filters. Try another search." />
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              data-testid="companies-list"
            >
              {gridItems}
            </div>
            <div className="mt-5">
              <CompaniesListPagination totalPages={totalPages} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
