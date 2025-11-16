"use client";

import type { Company } from "@/lib/types";
import { matchCompanies } from "@/lib/utils";
import { useMemo } from "react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import CompaniesListFooter from "./CompaniesListFooter";
import { CompaniesListHeader } from "./CompaniesListHeader";
import CompanyItem from "./CompanyItem";
import { EmptyState } from "./EmptyState";
import { NotificationsSideSection } from "./NotificationsSideSection";

const PAGE_SIZE = 15;

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
      {!paginatedCompanies.length ? (
        <div className="flex-1 font-mono flex items-center justify-center">
          <EmptyState title="No companies found" />
        </div>
      ) : (
        <div className="flex-1 font-mono">
          {isDedicatedPage && (
            <div className="mb-2 text-xs w-full flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
              <CompaniesListHeader
                totalPages={totalPages}
                filteredCompanies={filteredCompanies}
              />
            </div>
          )}
          <div className="flex-1 space-y-4" data-testid="companies-list">
            {paginatedCompanies.map((company) => (
              <CompanyItem key={company.slug} company={company} />
            ))}
            <CompaniesListFooter totalPages={totalPages} />
          </div>
        </div>
      )}
      <div className="block lg:hidden space-y-4">
        <NotificationsSideSection />
      </div>
    </>
  );
}
