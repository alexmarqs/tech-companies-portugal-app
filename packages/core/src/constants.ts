/** `unstable_cache` tag for the companies catalogue; expired by `sync-companies`. */
export const COMPANIES_DATA_TAG = "companies-data";

export const APP_URL = process.env.VERCEL_URL
  ? "https://techcompaniesportugal.fyi"
  : "http://localhost:3000";

/** Tabs on the `/settings` page, also linked from emails (`?tab=`). */
export enum SettingsTab {
  ACCOUNT = "account",
  NOTIFICATIONS = "notifications",
}
