import {
  createLoader,
  createSearchParamsCache,
  parseAsFloat,
  parseAsString,
} from "nuqs/server";

export const defaultSearchParams = {
  query: "",
  category: "",
  location: "",
  page: 1,
};

// can be used in the client as well
export const searchParamsQueryStateKeys = {
  query: parseAsString.withDefault(defaultSearchParams.query),
  category: parseAsString.withDefault(defaultSearchParams.category),
  location: parseAsString.withDefault(defaultSearchParams.location),
  page: parseAsFloat.withDefault(defaultSearchParams.page),
};

// for server side
export const loadSearchParams = createLoader(searchParamsQueryStateKeys);

// For getting server side cached search params in nested components tree
export const searchParamsCache = createSearchParamsCache(
  searchParamsQueryStateKeys,
);
