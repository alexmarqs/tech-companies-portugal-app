import type { Company } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import { Badge } from "./ui/badge";

type CompaniesListHeaderProps = {
  totalPages: number;
  filteredCompanies: Company[];
};

export const CompaniesListHeader = ({
  totalPages,
  filteredCompanies,
}: CompaniesListHeaderProps) => {
  const {
    setSearchParams,
    searchParams: { page: currentPage },
  } = useSearchQueryParams();

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <>
      <div className="h-8" />
      <Badge
        variant="outline"
        className="border-none rounded-none bg-white px-1 flex items-center justify-center h-8 whitespace-nowrap"
      >
        Page {currentPage} of {totalPages}
        <span className="hidden md:inline-block">
          &nbsp;• {filteredCompanies.length}
        </span>
        <div className="ml-2 inline-flex items-center justify-center gap-1">
          <div
            onClick={() => setSearchParams({ page: 1 })}
            className={cn(
              "hover:text-foreground flex items-center justify-center hover:cursor-pointer",
              isPreviousDisabled && "pointer-events-none text-muted-foreground",
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchParams({ page: 1 });
              }
            }}
          >
            <ChevronsLeft className="inline" size={18} />
          </div>
          <div
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchParams({ page: currentPage - 1 });
              }
            }}
            onClick={() => setSearchParams({ page: currentPage - 1 })}
            className={cn(
              "hover:text-foreground flex items-center justify-center hover:cursor-pointer",
              isPreviousDisabled && "pointer-events-none text-muted-foreground",
            )}
          >
            <ChevronLeft className="inline" size={18} />
          </div>
          <div
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchParams({ page: currentPage + 1 });
              }
            }}
            onClick={() => setSearchParams({ page: currentPage + 1 })}
            className={cn(
              "hover:text-foreground flex items-center justify-center hover:cursor-pointer",
              isNextDisabled && "pointer-events-none text-muted-foreground",
            )}
          >
            <ChevronRight className="inline" size={18} />
          </div>
          <div
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchParams({ page: totalPages });
              }
            }}
            onClick={() => setSearchParams({ page: totalPages })}
            className={cn(
              "hover:text-foreground flex items-center justify-center hover:cursor-pointer",
              isNextDisabled && "pointer-events-none text-muted-foreground",
            )}
          >
            <ChevronsRight className="inline" size={18} />
          </div>
        </div>
      </Badge>
    </>
  );
};
