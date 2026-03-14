import type { Company } from "@/lib/types";
import CompanyItem from "./CompanyItem";

const PAGE_SIZE = 12;

type CompaniesListFallbackProps = {
  companies: Company[];
  isDedicatedPage?: boolean;
};

/**
 * Static (server-rendered) fallback for CompaniesList.
 * Renders page 1 with default values — no useSearchParams or client hooks needed.
 * Used as a Suspense fallback so users see real content instead of skeleton
 * placeholders while useSearchParams resolves during hydration.
 */
export function CompaniesListFallback({
  companies,
  isDedicatedPage = false,
}: CompaniesListFallbackProps) {
  const paginatedCompanies = companies.slice(0, PAGE_SIZE);
  const totalPages = Math.ceil(companies.length / PAGE_SIZE);

  return (
    <div className="flex-1">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {isDedicatedPage && (
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View all companies
          </a>
        )}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {companies.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {companies.length} companies
              {totalPages > 1 ? ` · Page 1/${totalPages}` : ""}
            </span>
          )}
        </div>
      </div>
      {paginatedCompanies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedCompanies.map((company) => (
            <CompanyItem key={company.slug} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
