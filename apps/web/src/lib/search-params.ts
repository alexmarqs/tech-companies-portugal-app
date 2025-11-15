import {
  createLoader,
  createSearchParamsCache,
  parseAsFloat,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const defaultSearchParams = {
  query: "",
  category: "",
  location: "",
  page: 1,
};

export enum SettingsTab {
  ACCOUNT = "account",
  NOTIFICATIONS = "notifications",
}

export const defaultSettings = {
  tab: SettingsTab.ACCOUNT,
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

// query state keys for the settings page
export const settingsQueryStateKeys = {
  tab: parseAsStringEnum<SettingsTab>(Object.values(SettingsTab)).withDefault(
    defaultSettings.tab,
  ),
};

// for server side
export const loadSettings = createLoader(settingsQueryStateKeys);

// For getting server side cached settings in nested components tree
export const settingsCache = createSearchParamsCache(settingsQueryStateKeys);
