"use client";

import { Company } from "@/lib/types";
import { matchCompanies } from "@/lib/utils";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CompaniesListFooter from "./CompaniesListFooter";
import { CompaniesListHeader } from "./CompaniesListHeader";
import CompanyItem from "./CompanyItem";
import { EmptyState } from "./EmptyState";
import FeaturedSideSection from "./FeaturedSideSection";

const PAGE_SIZE = 15;

export default function CompaniesList({
  allCompanies,
  updatedAtISODate,
}: {
  allCompanies: Company[];
  updatedAtISODate: string;
}) {
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const filteredCompanies = useMemo(
    () =>
      allCompanies.filter((company) =>
        matchCompanies(company, query, category, location),
      ),
    [allCompanies, query, category, location],
  );

  const paginatedCompanies = filteredCompanies.slice(start, end);
  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);

  return (
    <>
      {!paginatedCompanies.length ? (
        <motion.div
          className="flex-1 font-mono"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <EmptyState
            title="No companies found"
            description="We couldn't find any companies matching your search."
          />
        </motion.div>
      ) : (
        <div className="flex-1 font-mono">
          <motion.div
            className="mb-2 text-xs w-full flex flex-col md:flex-row items-center justify-between gap-2 text-muted-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CompaniesListHeader
              updatedAtISODate={updatedAtISODate}
              currentPage={currentPage}
              totalPages={totalPages}
              filteredCompanies={filteredCompanies}
              searchParams={searchParams}
            />
          </motion.div>
          <div className="flex-1 space-y-4">
            {paginatedCompanies.map((company, index) => (
              <motion.div
                key={company.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <CompanyItem company={company} />
              </motion.div>
            ))}
            <CompaniesListFooter
              currentPage={currentPage}
              totalPages={totalPages}
              searchParams={searchParams}
            />
          </div>
        </div>
      )}
      <div className="block md:hidden">
        <FeaturedSideSection />
      </div>
    </>
  );
}
