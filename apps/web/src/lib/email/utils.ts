import type { EmailServiceParams } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_EMAIL_FROM =
  process.env.PLUNK_FROM_EMAIL ??
  "Tech Companies Portugal <hello@techcompaniesportugal.fyi>";
const DEFAULT_EMAIL_TYPE: EmailServiceParams["type"] = "html";

const normalizeRecipients = (to: EmailServiceParams["to"]): string[] => {
  const recipients = Array.isArray(to) ? to : [to];

  if (!recipients.length) {
    throw new Error("Invalid 'to' field: provide at least one email address.");
  }

  return recipients.map((recipient) => {
    const sanitized = recipient.trim();

    if (!sanitized) {
      throw new Error(
        "Invalid 'to' field: recipients must be non-empty strings.",
      );
    }

    if (!EMAIL_PATTERN.test(sanitized)) {
      throw new Error(`Invalid email address: ${sanitized}`);
    }

    return sanitized;
  });
};

export { normalizeRecipients, DEFAULT_EMAIL_FROM, DEFAULT_EMAIL_TYPE };
