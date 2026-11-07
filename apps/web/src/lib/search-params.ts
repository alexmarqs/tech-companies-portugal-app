import { SettingsTab } from "@tech-companies-portugal/core";
import { parseAsFloat, parseAsString, parseAsStringEnum } from "nuqs/server";

export { SettingsTab };

const defaultSearchParams = {
  query: "",
  category: "",
  location: "",
  page: 1,
};

export const LABELS_FILTER: Record<string, string> = {
  query: "Search",
  category: "Category",
  location: "Location",
};

const defaultSettings = {
  tab: SettingsTab.ACCOUNT,
};

// can be used in the client as well
export const searchParamsQueryStateKeys = {
  query: parseAsString.withDefault(defaultSearchParams.query),
  category: parseAsString.withDefault(defaultSearchParams.category),
  location: parseAsString.withDefault(defaultSearchParams.location),
  page: parseAsFloat.withDefault(defaultSearchParams.page),
};

// query state keys for the settings page
export const settingsQueryStateKeys = {
  tab: parseAsStringEnum<SettingsTab>(Object.values(SettingsTab)).withDefault(
    defaultSettings.tab,
  ),
};
