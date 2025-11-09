const DEFAULT_EMAIL_FROM =
  process.env.PLUNK_FROM_EMAIL || "hello@techcompaniesportugal.fyi";

const DEFAULT_EMAIL_NAME =
  process.env.PLUNK_FROM_NAME || "Tech Companies Portugal";

const DEFAULT_EMAIL_FROM_NOTIFICATIONS =
  process.env.PLUNK_FROM_EMAIL_NOTIFICATIONS ||
  "reports@techcompaniesportugal.fyi";

export {
  DEFAULT_EMAIL_FROM,
  DEFAULT_EMAIL_NAME,
  DEFAULT_EMAIL_FROM_NOTIFICATIONS,
};
