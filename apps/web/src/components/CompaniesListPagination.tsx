import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import { Button } from "./ui/button";

type CompaniesListPaginationProps = {
  totalPages: number;
};

const ELLIPSIS = "ellipsis" as const;

// MUI-style page list: always show the first and last page, a window around the
// current page, and collapse the rest with ellipses.
function getPageItems(
  current: number,
  total: number,
): (number | typeof ELLIPSIS)[] {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  if (total <= 7) return range(1, total);

  const showLeftDots = current - 1 > 2;
  const showRightDots = current + 1 < total - 1;

  if (!showLeftDots && showRightDots) return [...range(1, 5), ELLIPSIS, total];
  if (showLeftDots && !showRightDots)
    return [1, ELLIPSIS, ...range(total - 4, total)];
  return [1, ELLIPSIS, ...range(current - 1, current + 1), ELLIPSIS, total];
}

export default function CompaniesListPagination({
  totalPages,
}: CompaniesListPaginationProps) {
  const {
    setSearchParams,
    searchParams: { page: currentPage },
  } = useSearchQueryParams();

  if (totalPages <= 1) return null;

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;
  const items = getPageItems(currentPage, totalPages);

  return (
    <div
      className="flex items-center justify-center"
      data-testid="companies-list-footer"
    >
      <div className="inline-flex items-center gap-1 rounded-xl border border-border/60 bg-card p-1 shadow-sm shadow-black/5">
        <Button
          className="h-8 px-2!"
          variant="ghost"
          size="sm"
          aria-label="Previous page"
          disabled={isPreviousDisabled}
          onClick={() => setSearchParams({ page: currentPage - 1 })}
        >
          <ChevronLeft className="shrink-0" size={16} />
        </Button>

        {items.map((item, i) =>
          item === ELLIPSIS ? (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis position is stable per render
              key={`ellipsis-${i}`}
              className="px-1.5 text-sm text-muted-foreground/60 select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              variant="ghost"
              size="sm"
              aria-label={`Go to page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
              className={cn(
                "h-8 min-w-8 px-2 tabular-nums",
                item === currentPage &&
                  "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white",
              )}
              onClick={() => setSearchParams({ page: item })}
            >
              {item}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2!"
          aria-label="Next page"
          disabled={isNextDisabled}
          onClick={() => setSearchParams({ page: currentPage + 1 })}
        >
          <ChevronRight className="shrink-0" size={16} />
        </Button>
      </div>
    </div>
  );
}
