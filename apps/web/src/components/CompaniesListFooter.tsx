import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import { Button } from "./ui/button";

type CompaniesListFooterProps = {
  totalPages: number;
};

export default function CompaniesListFooter({
  totalPages,
}: CompaniesListFooterProps) {
  const {
    setSearchParams,
    searchParams: { page: currentPage },
  } = useSearchQueryParams();

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div
      className="flex items-center justify-center gap-3 py-2"
      data-testid="companies-list-footer"
    >
      <div className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card p-1">
        <Button
          className={cn(
            isPreviousDisabled &&
              "pointer-events-none text-muted-foreground/40",
            "px-2! h-8",
          )}
          variant="ghost"
          size="sm"
          onClick={() => setSearchParams({ page: 1 })}
        >
          <ChevronsLeft className="shrink-0" size={16} />
        </Button>
        <Button
          className={cn(
            isPreviousDisabled &&
              "pointer-events-none text-muted-foreground/40",
            "px-2! h-8",
          )}
          variant="ghost"
          size="sm"
          onClick={() => setSearchParams({ page: currentPage - 1 })}
        >
          <ChevronLeft className="shrink-0" size={16} />
        </Button>

        <span className="px-3 text-sm font-medium text-muted-foreground tabular-nums">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            isNextDisabled && "pointer-events-none text-muted-foreground/40",
            "px-2! h-8",
          )}
          onClick={() => setSearchParams({ page: currentPage + 1 })}
        >
          <ChevronRight className="shrink-0" size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            isNextDisabled && "pointer-events-none text-muted-foreground/40",
            "px-2! h-8",
          )}
          onClick={() => setSearchParams({ page: totalPages })}
        >
          <ChevronsRight className="shrink-0" size={16} />
        </Button>
      </div>
    </div>
  );
}
