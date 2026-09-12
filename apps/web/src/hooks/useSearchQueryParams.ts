"use client";

import { searchParamsQueryStateKeys } from "@/lib/search-params";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";

// nuqs keeps query state in a module-level store, so every caller of this hook
// reads and writes the same values — no context needed to share them. It does
// need to run inside a Suspense boundary: the nuqs app router adapter reads
// useSearchParams() under the hood.
export const useSearchQueryParams = () => {
  const [searchParams, setSearchParams] = useQueryStates(
    searchParamsQueryStateKeys,
    {
      // Filters update in place; jumping back to the top on every keystroke or
      // selection makes the directory feel like a submitted form.
      scroll: false,
    },
  );

  const appliedFilters = useMemo(
    () =>
      Object.entries(searchParams).filter(
        ([key, value]) => key !== "page" && !!value && value !== "all",
      ),
    [searchParams],
  );

  return {
    searchParams,
    setSearchParams,
    appliedFilters,
  };
};
