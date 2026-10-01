import { getListedCompaniesCreatedAfter } from "@tech-companies-portugal/core/server";
import {
  DEFAULT_EMAIL_FROM_NOTIFICATIONS,
  emailService,
  render,
} from "@tech-companies-portugal/email";
import WeeklyNewCompaniesEmail from "@tech-companies-portugal/email/templates/weekly-new-companies";
import { createAdminClient } from "@tech-companies-portugal/supabase/server";
import { FatalError, RetryableError, sleep } from "workflow";

const EMAIL_BATCH_SIZE = 3;
const EMAIL_BATCH_DELAY = "2s";

/** Matches the weekly cron in `apps/web/vercel.json` (Mondays 09:00). */
const DIGEST_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

type NewCompany = {
  slug: string;
  name: string;
};

export type WeeklyDigestWorkflowResult = {
  status: "no-new-companies" | "no-subscribers" | "emails-sent";
  newCompaniesCount: number;
  subscribersCount: number;
  sentCount: number;
  failedCount: number;
};

/**
 * Workflow that emails subscribers about companies added to the directory
 * (`companies.created_at`) in the last week.
 */
export async function weeklyDigestWorkflow(): Promise<WeeklyDigestWorkflowResult> {
  "use workflow";

  // Get the new companies
  const newCompanies = await getNewCompanies();

  if (newCompanies.length === 0) {
    return {
      status: "no-new-companies",
      newCompaniesCount: 0,
      subscribersCount: 0,
      sentCount: 0,
      failedCount: 0,
    };
  }

  // Get the subscribed users emails
  const subscribedUsersEmails = await getSubscribedUsersEmails();

  if (subscribedUsersEmails.length === 0) {
    return {
      status: "no-subscribers",
      newCompaniesCount: newCompanies.length,
      subscribersCount: 0,
      sentCount: 0,
      failedCount: 0,
    };
  }

  let sentCount = 0;
  let failedCount = 0;

  for (
    let index = 0;
    index < subscribedUsersEmails.length;
    index += EMAIL_BATCH_SIZE
  ) {
    const batch = subscribedUsersEmails.slice(index, index + EMAIL_BATCH_SIZE);

    // allSettled so one bad address cannot fail everyone else's email.
    const results = await Promise.allSettled(
      batch.map((email) => sendDigestEmail(email, newCompanies)),
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        sentCount += 1;
      } else {
        failedCount += 1;
      }
    }

    const hasMore = index + EMAIL_BATCH_SIZE < subscribedUsersEmails.length;

    if (hasMore) {
      await sleep(EMAIL_BATCH_DELAY);
    }
  }

  // Fail the run loudly so it shows up in `workflow inspect runs`. There is no
  // retry: next week's window will not include these companies.
  if (sentCount === 0) {
    throw new FatalError(
      `Weekly digest: all ${failedCount} sends failed for ${newCompanies.length} new companies.`,
    );
  }

  return {
    status: "emails-sent",
    newCompaniesCount: newCompanies.length,
    subscribersCount: subscribedUsersEmails.length,
    sentCount,
    failedCount,
  };
}

/**
 * Reads the `companies` table directly. The daily `sync-companies` import
 * expires the site's `companies-data` cache tag whenever it inserts, so a new
 * company's `/company/<slug>` page is live by the time this runs.
 */
async function getNewCompanies(): Promise<NewCompany[]> {
  "use step";

  // Computed inside the step so a workflow replay reuses the same window.
  const since = new Date(Date.now() - DIGEST_WINDOW_MS).toISOString();

  const rows = await getListedCompaniesCreatedAfter(since);

  console.log(`[weekly-digest] ${rows.length} companies added since ${since}`);

  return rows.map((row) => ({ slug: row.slug, name: row.name }));
}

async function getSubscribedUsersEmails(): Promise<string[]> {
  "use step";

  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("notification_settings")
    .select("users (email)")
    .eq("type", "new_companies")
    .eq("channel", "email")
    .eq("enabled", true);

  if (error) {
    console.error("[weekly-digest] failed to read subscribers", error);
    throw error;
  }

  const emails =
    data
      ?.map((notificationSetting) => notificationSetting.users?.email)
      .filter(
        (email): email is string =>
          typeof email === "string" && email.length > 0,
      ) ?? [];

  const uniqueEmails = Array.from(new Set(emails));

  console.log(`[weekly-digest] ${uniqueEmails.length} subscriber(s) to notify`);

  return uniqueEmails;
}

async function sendDigestEmail(
  email: string,
  newCompanies: NewCompany[],
): Promise<void> {
  "use step";

  const companyLabel = newCompanies.length === 1 ? "company" : "companies";

  try {
    const emailHtml = await render(WeeklyNewCompaniesEmail({ newCompanies }));

    await emailService.sendEmail({
      to: email,
      from: DEFAULT_EMAIL_FROM_NOTIFICATIONS,
      subject: `${newCompanies.length} new ${companyLabel} on the Portugal tech map`,
      body: emailHtml,
    });
  } catch (error) {
    if (isRateLimitError(error)) {
      console.warn("[weekly-digest] Plunk rate limited, backing off");
      throw new RetryableError("Plunk rate limited", { retryAfter: "30s" });
    }

    console.error("[weekly-digest] send failed", {
      recipientDomain: email.split("@")[1] ?? "unknown",
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }

  console.log(
    `[weekly-digest] sent digest (${newCompanies.length} ${companyLabel}) to @${email.split("@")[1] ?? "unknown"}`,
  );
}

// Matches the old Inngest worker's `retries: 1` — one retry, two attempts.
sendDigestEmail.maxRetries = 1;

/**
 * Best-effort, because Plunk gives us nothing better to go on: for any non-2xx
 * other than 401/404 its client throws a plain `Error(data?.message)` with no
 * status attached, so matching the message is the only live test. The `status`
 * check below is forward-compat only — it does not fire against @plunk/node
 * 3.0.3 today.
 */
function isRateLimitError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if ("status" in error && error.status === 429) {
    return true;
  }

  const message = error instanceof Error ? error.message : "";

  return /\b429\b|too many requests|rate limit/i.test(message);
}
