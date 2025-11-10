"use client";

import type { Company } from "@/lib/types";
import { matchCompanies } from "@/lib/utils";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import CompaniesListFooter from "./CompaniesListFooter";
import { CompaniesListHeader } from "./CompaniesListHeader";
import CompanyItem from "./CompanyItem";
import { EmptyState } from "./EmptyState";
import FeaturedSideSection from "./FeaturedSideSection";

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
        <motion.div
          className="flex-1 font-mono flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          aria-label="No companies found"
        >
          <EmptyState title="No companies found" />
        </motion.div>
      ) : (
        <div className="flex-1 font-mono" aria-label="Companies list">
          {isDedicatedPage && (
            <motion.div
              className="mb-2 text-xs w-full flex flex-wrap items-center justify-between gap-2 text-muted-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CompaniesListHeader
                totalPages={totalPages}
                filteredCompanies={filteredCompanies}
              />
            </motion.div>
          )}
          <div className="flex-1 space-y-4" data-testid="companies-list">
            {paginatedCompanies.map((company, index) => (
              <div key={company.slug} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  aria-label={`Company ${company.name}`}
                >
                  <CompanyItem company={company} />
                </motion.div>
                {index === Math.floor(paginatedCompanies.length / 2) - 1 ? (
                  <div ta-ad-container="" />
                ) : null}
              </div>
            ))}
            <CompaniesListFooter totalPages={totalPages} />
          </div>
        </div>
      )}
      <div className="block md:hidden">
        <FeaturedSideSection />
      </div>
    </>
  );
}
