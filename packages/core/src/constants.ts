/** `unstable_cache` tag for the companies catalogue; expired by `sync-companies`. */
export const COMPANIES_DATA_TAG = "companies-data";

export const APP_URL = process.env.VERCEL_URL
  ? "https://techcompaniesportugal.fyi"
  : "http://localhost:3000";

/** Requests per minute for new API keys; per-key overrides are set in the DB. */
export const API_KEY_RATE_LIMIT_PER_MINUTE = 60;

/**
 * Active (unrevoked, unexpired) keys a user may hold. Limits are per key, so
 * this also caps a user's total request rate.
 */
export const MAX_ACTIVE_API_KEYS = 2;

/** Tabs on the `/settings` page, also linked from emails (`?tab=`). */
export enum SettingsTab {
  ACCOUNT = "account",
  API_KEYS = "api-keys",
  NOTIFICATIONS = "notifications",
}
