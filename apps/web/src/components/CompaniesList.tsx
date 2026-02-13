"use client";

import type { Company } from "@/lib/types";
import { matchCompanies } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import CompaniesListFooter from "./CompaniesListFooter";
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
        <div className="flex-1 flex items-center text-muted-foreground justify-center min-h-[300px]">
          <EmptyState title="Ups, no companies found. Try another search." />
        </div>
      ) : (
        <div className="flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            {isDedicatedPage ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                View all companies
              </Link>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
                Showing {filteredCompanies.length} companies
              </span>
            </div>
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-testid="companies-list"
          >
            {paginatedCompanies.map((company) => (
              <CompanyItem key={company.slug} company={company} />
            ))}
          </div>
          <div className="mt-6">
            <CompaniesListFooter totalPages={totalPages} />
          </div>
        </div>
      )}
      <div className="block lg:hidden space-y-4 mt-6">
        <NotificationsSideSection />
      </div>
    </>
  );
}
