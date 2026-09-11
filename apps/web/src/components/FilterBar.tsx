"use client";

import { cn } from "@/lib/utils";
import { MapPin, Search, Shapes, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "./ui/select";

type FilterBarProps = {
  locationOptions: string[];
  categoryOptions: string[];
};

const triggerClass = (active: boolean) =>
  cn(
    "h-12 min-w-0 cursor-pointer rounded-xl border bg-background px-4 shadow-none outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 md:rounded-none md:border-y-0 md:border-r-0 md:bg-transparent",
    active
      ? "border-primary/35 bg-accent font-medium text-accent-foreground data-[state=open]:border-primary/50"
      : "border-border/80 data-[state=open]:border-primary/40 hover:bg-muted/50 md:border-l",
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
    <div className="sticky top-[65px] z-30 -mx-4 mb-7 bg-background/95 px-4 py-3 backdrop-blur-xl md:static md:z-auto md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
      <div className="grid gap-2 rounded-2xl border border-border/80 bg-card p-2 shadow-[0_16px_40px_-30px_oklch(0.3_0.04_40/0.4)] md:grid-cols-[minmax(0,1fr)_200px_200px_auto] md:gap-0">
        {/* Keyword search */}
        <div className="relative flex flex-1 items-center">
          <Search
            className="pointer-events-none absolute left-4 z-10 size-4.5 text-primary"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            id="query"
            name="query"
            value={searchParams.query}
            onChange={(e) =>
              setSearchParams({ query: e.target.value || null, page: 1 })
            }
            placeholder="Search by company, product or keyword..."
            aria-label="Search by name or description"
            className="h-12 w-full truncate border-0 bg-transparent pl-11 pr-10 text-base text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 md:pr-14"
          />
          {searchParams.query ? (
            <button
              type="button"
              onClick={() => {
                setSearchParams({ query: null, page: 1 });
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden size-6 -translate-y-1/2 select-none items-center justify-center rounded-md border border-border/70 bg-muted text-[11px] font-semibold text-muted-foreground md:flex">
              /
            </kbd>
          )}
        </div>

        {/* Facets */}
        <div className="contents">
          <Select
            value={searchParams.category || "all"}
            onValueChange={(value) =>
              setSearchParams(
                {
                  category: value === "all" ? null : value,
                  page: 1,
                },
                { scroll: true },
              )
            }
          >
            <SelectTrigger
              id="category"
              aria-label="Category"
              className={triggerClass(
                !!searchParams.category && searchParams.category !== "all",
              )}
            >
              <Shapes className="shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-left">
                {searchParams.category || "All categories"}
              </span>
            </SelectTrigger>
            <SelectContent align="start" sideOffset={6}>
              <SelectGroup>
                <SelectItem value="all">All categories</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={searchParams.location || "all"}
            onValueChange={(value) =>
              setSearchParams(
                {
                  location: value === "all" ? null : value,
                  page: 1,
                },
                { scroll: true },
              )
            }
          >
            <SelectTrigger
              id="location"
              aria-label="Location"
              className={triggerClass(
                !!searchParams.location && searchParams.location !== "all",
              )}
            >
              <MapPin className="shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-left">
                {searchParams.location || "All locations"}
              </span>
            </SelectTrigger>
            <SelectContent align="start" sideOffset={6}>
              <SelectGroup>
                <SelectItem value="all">All locations</SelectItem>
                {locationOptions.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Reset — only shown when there's something to clear */}
        {appliedFilters.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-auto shrink-0 self-end rounded-xl px-3 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground md:h-12 md:self-auto"
            onClick={() => setSearchParams(null, { scroll: true })}
            aria-label="Clear all filters"
          >
            <X data-icon="inline-start" aria-hidden="true" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
