import {
  defaultSearchParams,
  searchParamsQueryStateKeys,
} from "@/lib/search-params";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";

export const useSearchQueryParams = (enabled = true) => {
  const [searchParams, setSearchParams] = useQueryStates(
    searchParamsQueryStateKeys,
    {
      scroll: true,
    },
  );

  const appliedFilters = useMemo(
    () =>
      enabled
        ? Object.entries(searchParams).filter(
            ([key, value]) => key != "page" && !!value,
          )
        : [],
    [searchParams, enabled],
  );

  return {
    searchParams: enabled ? searchParams : defaultSearchParams,
    setSearchParams: enabled ? setSearchParams : () => {},
    appliedFilters,
  };
};
