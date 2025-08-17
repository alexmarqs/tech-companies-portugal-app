import { searchParamsQueryStateKeys } from "@/lib/search-params";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";

export const useSearchQueryParams = () => {
  const [searchParams, setSearchParams] = useQueryStates(
    searchParamsQueryStateKeys,
    {
      scroll: true,
    },
  );

  const appliedFilters = useMemo(
    () =>
      Object.entries(searchParams).filter(
        ([key, value]) => key !== "page" && !!value,
      ),
    [searchParams],
  );

  return {
    searchParams,
    setSearchParams,
    appliedFilters,
  };
};
