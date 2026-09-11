"use client";

import { useKeepResultsInView } from "@/hooks/useKeepResultsInView";
import { LABELS_FILTER } from "@/lib/search-params";
import type { Company } from "@/lib/types";
import { cn, matchCompanies } from "@/lib/utils";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import CompaniesListPagination from "./CompaniesListPagination";
import CompanyItem from "./CompanyItem";
import { EmptyState } from "./EmptyState";

const PAGE_SIZE = 12;

type CompaniesListProps = {
  allCompanies: Company[];
  isDedicatedPage?: boolean;
};

export default function CompaniesList({
  allCompanies,
  isDedicatedPage = false,
}: CompaniesListProps) {
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

  const { listRef } = useKeepResultsInView(filteredCompanies.length);

  const start = (page - 1) * PAGE_SIZE;
  const paginatedCompanies = filteredCompanies.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);

  return (
    <>
      <div
        ref={listRef}
        className={cn(
          "flex-1 scroll-mt-[21rem] md:scroll-mt-24",
          !isDedicatedPage && "min-h-[60svh]",
        )}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
          {isDedicatedPage && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="size-3.5" />
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
                        setSearchParams(
                          { [key]: null, page: 1 },
                          { scroll: true },
                        );
                      }}
                      aria-label={`Remove ${LABELS_FILTER[key] || key} filter`}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    >
                      <span className="text-muted-foreground">
                        {LABELS_FILTER[key] || key}:
                      </span>
                      <span className="max-w-[180px] truncate text-foreground">
                        {value}
                      </span>
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-foreground/10 group-hover:text-foreground">
                        <X className="size-3" />
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>
          {filteredCompanies.length > 0 && (
            <span
              className="mr-2 shrink-0 text-xs font-medium tabular-nums text-muted-foreground"
              data-testid="results-count"
            >
              Showing {start + 1}–{start + paginatedCompanies.length} of{" "}
              {filteredCompanies.length}
            </span>
          )}
        </div>
        {!paginatedCompanies.length ? (
          <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-border/70 bg-card p-6 text-muted-foreground">
            <EmptyState title="No companies match your filters. Try another search." />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3" data-testid="companies-list">
              {paginatedCompanies.map((company) => (
                <CompanyItem key={company.slug} company={company} />
              ))}
            </div>
            <div className="mt-7">
              <CompaniesListPagination totalPages={totalPages} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
