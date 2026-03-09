"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import { Badge } from "./ui/badge";

type SearchSideBarProps = {
  locationOptions: string[];
  categoryOptions: string[];
  onResetAction?: () => void;
  showCountBadge?: boolean;
  enableKeyboardShortcut?: boolean;
};

export function SearchSideBar({
  locationOptions,
  categoryOptions,
  onResetAction,
  showCountBadge = true,
  enableKeyboardShortcut = false,
}: SearchSideBarProps) {
  const { setSearchParams, searchParams, appliedFilters } =
    useSearchQueryParams();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!enableKeyboardShortcut) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboardShortcut]);

  return (
    <div className="w-full flex flex-col h-full gap-4 justify-between">
      <div className="shrink-0 w-full lg:w-[300px] lg:mx-auto relative bg-card rounded-xl border border-border/60 p-5">
        {showCountBadge && appliedFilters.length > 0 && (
          <div className="absolute -top-2 -right-2">
            <Badge className="text-[10px] px-2 py-[3px] rounded-full shadow-sm text-white bg-primary">
              {appliedFilters.length}
            </Badge>
          </div>
        )}

        <form
          className="w-full"
          aria-label="Search form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <fieldset>
            <legend className="sr-only">Search Filters</legend>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="query"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Keywords
                </Label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={14}
                  />
                  <Input
                    ref={inputRef}
                    id="query"
                    name="query"
                    onChange={(e) => {
                      setSearchParams(
                        { query: e.target.value, page: 1 },
                        { throttleMs: 250 },
                      );
                    }}
                    value={searchParams.query || ""}
                    placeholder="Name or description"
                    className="pl-9 h-10 rounded-lg bg-muted/30"
                    aria-label="Search by name or description"
                  />
                  {enableKeyboardShortcut && !searchParams.query && (
                    <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground/60 border border-border/60 rounded px-1.5 py-0.5">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="category"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Industry
                </Label>
                <Select
                  value={searchParams.category || "all"}
                  onValueChange={(value) =>
                    setSearchParams({ category: value, page: 1 })
                  }
                  aria-label="Select a category"
                >
                  <SelectTrigger
                    id="category"
                    className="w-full h-10 rounded-lg bg-muted/30"
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
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="location"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Location
                </Label>
                <Select
                  value={searchParams.location || "all"}
                  onValueChange={(value) =>
                    setSearchParams({ location: value, page: 1 })
                  }
                  aria-label="Select a location"
                >
                  <SelectTrigger
                    id="location"
                    className="w-full h-10 rounded-lg bg-muted/30"
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

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  disabled={appliedFilters.length === 0}
                  className="h-10 flex-1"
                  onClick={() => {
                    setSearchParams(null);
                    onResetAction?.();
                  }}
                  aria-label="Reset filters"
                >
                  <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Reset
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
