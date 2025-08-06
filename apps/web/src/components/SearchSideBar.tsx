"use client";

import { X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { Button } from "./ui/button";
import { RetroContainer } from "./ui/retro-container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { useSearchQueryParams } from "./hooks/useSearchQueryParams";
import { Badge } from "./ui/badge";

type SearchSideBarProps = {
  locationOptions: string[];
  categoryOptions: string[];
  extendedUI?: () => React.ReactNode;
  onReset?: () => void;
  showCountBadge?: boolean;
};

export function SearchSideBar({
  locationOptions,
  categoryOptions,
  extendedUI,
  onReset,
  showCountBadge = true,
}: SearchSideBarProps) {
  const { setSearchParams, searchParams, appliedFilters } =
    useSearchQueryParams();

  return (
    <div className="w-full flex flex-col h-full gap-4 justify-between">
      <RetroContainer
        variant="static"
        className="shrink-0 md:w-[290px] md:mx-auto relative"
      >
        {showCountBadge && (
          <div className="absolute top-0 right-0 text-xs p-1">
            {appliedFilters.length > 0 && (
              <Badge className="text-xs px-2 m-0">
                {appliedFilters.length}
              </Badge>
            )}
          </div>
        )}

        <form
          className="px-4 py-3 w-full"
          aria-label="Search form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <fieldset className="mt-2">
            <legend className="sr-only">Search Filters</legend>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="query">Search term</Label>
                <Input
                  id="query"
                  name="query"
                  onChange={(e) => {
                    setSearchParams(
                      { query: e.target.value, page: 1 },
                      { throttleMs: 250 },
                    );
                  }}
                  value={searchParams.query || ""}
                  placeholder="Name or description term"
                  aria-label="Search by name or description"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={searchParams.category || "all"}
                  onValueChange={(value) =>
                    setSearchParams({ category: value, page: 1 })
                  }
                  aria-label="Select a category"
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={searchParams.location || "all"}
                  onValueChange={(value) =>
                    setSearchParams({ location: value, page: 1 })
                  }
                  aria-label="Select a location"
                >
                  <SelectTrigger id="location" className="w-full">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {locationOptions.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="secondary"
                disabled={appliedFilters.length === 0}
                className="h-9 w-full px-2"
                onClick={() => {
                  setSearchParams(null);
                  onReset?.();
                }}
                aria-label="Reset filters"
              >
                <X className="mr-[2px] h-4 w-4" aria-hidden="true" />
                Reset filters
              </Button>
              {extendedUI?.()}
            </div>
          </fieldset>
        </form>
      </RetroContainer>
    </div>
  );
}
