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

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const filteredCompanies = useMemo(
    () =>
      isDedicatedPage
        ? allCompanies
        : allCompanies.filter((company) =>
            matchCompanies(company, query, category, location),
          ),
    [allCompanies, query, category, location, isDedicatedPage],
  );

  const paginatedCompanies = filteredCompanies.slice(start, end);
  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);

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
            {filteredCompanies.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Showing {filteredCompanies.length}{" "}
                {appliedFilters.length > 0 ? "filtered companies" : "companies"}
                {totalPages > 1 ? ` · Page ${page}/${totalPages}` : ""}
              </span>
            )}
            {appliedFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {appliedFilters.map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSearchParams({ [key]: null, page: 1 });
                    }}
                    className="border border-dashed hover:border-muted inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    <span className="text-muted-foreground">
                      {LABELS_FILTER[key] || key}:
                    </span>
                    <span className="max-w-[120px] truncate">{value}</span>
                    <X className="ml-0.5 h-3 w-3 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {!paginatedCompanies.length ? (
          <div className="flex-1 flex items-center text-muted-foreground justify-center min-h-[300px] border border-border/60 rounded-xl p-4 bg-muted/20">
            <EmptyState title="No companies match your filters. Try another search." />
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-testid="companies-list"
            >
              {paginatedCompanies.map((company) => (
                <CompanyItem key={company.slug} company={company} />
              ))}
            </div>
            <div className="mt-5">
              <CompaniesListPagination totalPages={totalPages} />
            </div>
          </>
        )}
      </div>

      <div className="block lg:hidden space-y-4 mt-6">
        <NotificationsSideSection />
      </div>
    </>
  );
}
