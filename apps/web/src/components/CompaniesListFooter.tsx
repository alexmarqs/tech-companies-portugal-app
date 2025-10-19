import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import { Badge } from "./ui/badge";
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
      className="flex items-center justify-between gap-2"
      data-testid="companies-list-footer"
    >
      <div className="flex basis-1/2 justify-end text-sm text-muted-foreground h-8">
        <Badge
          variant="outline"
          className="rounded-none bg-white px-1 gap-1 border-none"
        >
          Page {currentPage} of {totalPages}
        </Badge>
      </div>
      <div className="inline-flex flex-row items-center gap-2">
        <Button
          className={cn(
            isPreviousDisabled && "pointer-events-none text-muted-foreground",
            "!px-2 h-8 border-none",
          )}
          variant="outline"
          size="sm"
          onClick={() => setSearchParams({ page: 1 })}
        >
          <ChevronsLeft className="shrink-0" size={16} />
        </Button>
        <Button
          className={cn(
            isPreviousDisabled && "pointer-events-none text-muted-foreground",
            "!px-2 h-8 border-none",
          )}
          variant="outline"
          size="sm"
          onClick={() => setSearchParams({ page: currentPage - 1 })}
        >
          <ChevronLeft className="shrink-0" size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            isNextDisabled && "pointer-events-none text-muted-foreground",
            "!px-2 h-8 border-none",
          )}
          onClick={() => setSearchParams({ page: currentPage + 1 })}
        >
          <ChevronRight className="shrink-0" size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            isNextDisabled && "pointer-events-none text-muted-foreground",
            "!px-2 h-8 border-none",
          )}
          onClick={() => setSearchParams({ page: totalPages })}
        >
          <ChevronsRight className="shrink-0" size={16} />
        </Button>
      </div>
    </div>
  );
}
