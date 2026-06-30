"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type FilterBarProps = {
  locationOptions: string[];
  categoryOptions: string[];
};

const triggerClass = (active: boolean) =>
  cn(
    "h-11 min-w-0 rounded-xl border shadow-sm shadow-black/2 outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[180px] md:shadow-none",
    active
      ? "border-emerald-500/40 bg-emerald-500/10 font-medium text-emerald-700 data-[state=open]:border-emerald-500 md:border-transparent md:hover:bg-emerald-500/15 md:data-[state=open]:bg-emerald-500/15"
      : "border-border/60 bg-card data-[state=open]:border-primary/40 data-[state=open]:bg-muted/40 md:border-0 md:bg-transparent md:hover:bg-muted/50 md:focus:bg-muted/50 md:data-[state=open]:bg-muted/60",
  );

export function FilterBar({
  locationOptions,
  categoryOptions,
}: FilterBarProps) {
  const { setSearchParams, searchParams, appliedFilters } =
    useSearchQueryParams();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // "/" focuses search (unless already typing); ⌘K/Ctrl+K as a bonus.
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="sticky top-[56px] z-30 mb-5 -mx-4 border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur-md md:static md:z-auto md:mx-auto md:max-w-4xl md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
      <form
        aria-label="Search and filter companies"
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-2 md:flex-row md:items-center md:gap-1 md:rounded-2xl md:border md:border-border/50 md:bg-card/95 md:p-1.5 md:shadow-sm md:shadow-black/5 md:backdrop-blur-sm"
      >
        {/* Keyword search */}
        <div className="relative flex flex-1 items-center">
          <Search
            className="pointer-events-none absolute left-3.5 z-10 text-muted-foreground/70"
            size={18}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="query"
            name="query"
            value={searchParams.query || ""}
            onChange={(e) =>
              setSearchParams(
                { query: e.target.value, page: 1 },
                { throttleMs: 250 },
              )
            }
            placeholder="Search companies..."
            aria-label="Search by name or description"
            className="h-11 w-full text-ellipsis text-base rounded-xl border border-border/60 bg-card pl-11 pr-10 text-foreground shadow-sm shadow-black/2 placeholder:text-muted-foreground/70 focus:border-primary/40 focus:outline-none md:border-0 md:bg-transparent md:pr-14 md:shadow-none md:focus:border-0"
          />
          {searchParams.query ? (
            <button
              type="button"
              onClick={() => {
                setSearchParams({ query: "", page: 1 });
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 select-none items-center justify-center rounded-md border border-border/50 bg-muted/40 text-[12px] font-medium text-muted-foreground/60 md:flex">
              /
            </kbd>
          )}
        </div>

        {/* Divider (desktop) */}
        <span
          className="hidden h-7 w-px shrink-0 bg-border/60 md:block"
          aria-hidden="true"
        />

        {/* Facets */}
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-1">
          <Select
            value={searchParams.category || "all"}
            onValueChange={(value) =>
              setSearchParams({ category: value, page: 1 })
            }
          >
            <SelectTrigger
              id="category"
              aria-label="Category"
              className={triggerClass(
                !!searchParams.category && searchParams.category !== "all",
              )}
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span
            className="hidden h-7 w-px shrink-0 bg-border/60 md:block"
            aria-hidden="true"
          />

          <Select
            value={searchParams.location || "all"}
            onValueChange={(value) =>
              setSearchParams({ location: value, page: 1 })
            }
          >
            <SelectTrigger
              id="location"
              aria-label="Location"
              className={triggerClass(
                !!searchParams.location && searchParams.location !== "all",
              )}
            >
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locationOptions.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset — only shown when there's something to clear */}
        {appliedFilters.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            className="h-8 w-auto shrink-0 gap-0 self-end rounded-lg px-2 text-sm font-medium text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-700 md:h-11 md:self-auto md:px-3"
            onClick={() => setSearchParams(null)}
            aria-label="Clear all filters"
          >
            <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            Clear all
          </Button>
        )}
      </form>
    </div>
  );
}
