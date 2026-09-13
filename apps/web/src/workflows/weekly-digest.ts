import WeeklyNewCompaniesEmail from "@/emails/templates/weekly-new-companies";
import { emailService } from "@/lib/email";
import { DEFAULT_EMAIL_FROM_NOTIFICATIONS } from "@/lib/email/utils";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import { createAdminClient } from "@/lib/supabase/server";
import type { Company } from "@/lib/types";
import { render } from "@react-email/render";
import { FatalError, RetryableError, sleep } from "workflow";

/**
 * Vercel Workflow that emails subscribers about companies added to the
 * README since the last snapshot. Replaces the Inngest cron + fan-out worker.
 *
 * Notes:
 * - Uncaught exceptions (new Error) are retried by default (3 retries)
 * - FatalError skips retries
 * - RetryableError for custom retry logic
 * - Running steps in parallel just uses Promise.all
 * - `maxRetries` is a *step* property; setting it on the workflow function
 *   does nothing.
 */

const EMAIL_BATCH_SIZE = 3;
const EMAIL_BATCH_DELAY = "2s";

type NewCompany = {
  slug: string;
  name: string;
};

type CompaniesSnapshot = {
  id: string | null;
  slugs: string[];
};

export type WeeklyDigestWorkflowResult = {
  status:
    | "snapshot-created"
    | "no-new-companies"
    | "no-subscribers"
    | "emails-sent";
  newCompaniesCount: number;
  subscribersCount: number;
  sentCount: number;
  failedCount: number;
  snapshotAdvanced: boolean;
};

export async function weeklyDigestWorkflow(): Promise<WeeklyDigestWorkflowResult> {
  "use workflow";

  // Independent of each other, so read them in parallel.
  const [latestCompaniesSnapshot, currentCompanies] = await Promise.all([
    getLatestCompaniesSnapshot(),
    getCurrentCompanies(),
  ]);

  const currentCompaniesSlugs = currentCompanies.map((company) => company.slug);

  // First ever run (or an empty snapshot row): record a baseline and stop, so
  // we don't mail every company on the list as "new".
  if (
    !latestCompaniesSnapshot.id ||
    latestCompaniesSnapshot.slugs.length === 0
  ) {
    await createNewCompaniesSnapshot(currentCompaniesSlugs);

    return {
      status: "snapshot-created",
      newCompaniesCount: 0,
      subscribersCount: 0,
      sentCount: 0,
      failedCount: 0,
      snapshotAdvanced: true,
    };
  }

  const previousCompaniesSlugs = new Set(latestCompaniesSnapshot.slugs);

  const newCompanies = currentCompanies.filter(
    (company) => !previousCompaniesSlugs.has(company.slug),
  );

  if (newCompanies.length === 0) {
    return {
      status: "no-new-companies",
      newCompaniesCount: 0,
      subscribersCount: 0,
      sentCount: 0,
      failedCount: 0,
      snapshotAdvanced: false,
    };
  }

  const subscribedUsersEmails = await getSubscribedUsersEmails();

  // Nobody to mail, but the diff is real — advance the snapshot so next week
  // reports only what is new relative to today.
  if (subscribedUsersEmails.length === 0) {
    await updateCompaniesSnapshot(
      latestCompaniesSnapshot.id,
      currentCompaniesSlugs,
    );

    const result: WeeklyDigestWorkflowResult = {
      status: "no-subscribers",
      newCompaniesCount: newCompanies.length,
      subscribersCount: 0,
      sentCount: 0,
      failedCount: 0,
      snapshotAdvanced: true,
    };

    return result;
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

  // Only advance the snapshot once at least one subscriber actually received
  // this week's diff. If every send failed, the snapshot stays put so the next
  // run retries the same diff instead of silently losing it.
  if (sentCount === 0) {
    throw new FatalError(
      `Weekly digest: all ${failedCount} sends failed for ${newCompanies.length} new companies. Snapshot left at ${latestCompaniesSnapshot.id} so the diff is retried next run.`,
    );
  }

  await updateCompaniesSnapshot(
    latestCompaniesSnapshot.id,
    currentCompaniesSlugs,
  );

  const result: WeeklyDigestWorkflowResult = {
    status: "emails-sent",
    newCompaniesCount: newCompanies.length,
    subscribersCount: subscribedUsersEmails.length,
    sentCount,
    failedCount,
    snapshotAdvanced: true,
  };

  return result;
}

async function getLatestCompaniesSnapshot(): Promise<CompaniesSnapshot> {
  "use step";

  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("companies_snapshot")
    .select("id, slugs")
    .order("snapshot_date", { ascending: false }) // most recent snapshot
    .limit(1); // only one snapshot

  if (error) {
    console.error("[weekly-digest] failed to read companies snapshot", error);
    throw error;
  }

  const snapshot: CompaniesSnapshot = {
    id: data?.[0]?.id ?? null,
    slugs: data?.[0]?.slugs ?? [],
  };

  console.log(
    `[weekly-digest] latest snapshot id=${snapshot.id ?? "none"} slugs=${snapshot.slugs.length}`,
  );

  return snapshot;
}

/**
 * Reads through `getParsedCompaniesData()` — the same accessor the site uses —
 * so the digest can never announce a company that `/company/<slug>` cannot
 * render yet.
 *
 * That accessor is cached (`unstable_cache`, tag `companies-data`, 24h), and
 * we deliberately do not revalidate it here: a company added to the README
 * may wait for the cache to turn over before being announced, which is the
 * price of never linking to a page the site cannot render. A stale read is
 * self-correcting — an empty diff returns early without advancing the
 * snapshot, so the next run still sees those companies as new.
 */
async function getCurrentCompanies(): Promise<NewCompany[]> {
  "use step";

  const { companies: parsedCompanies } = await getParsedCompaniesData();

  const companies = parsedCompanies.map((company: Company) => ({
    slug: company.slug,
    name: company.name,
  }));

  console.log(`[weekly-digest] parsed ${companies.length} companies`);

  if (companies.length === 0) {
    // An empty parse means the README fetch degraded (expired GITHUB_TOKEN,
    // markup change). Treating it as "every company was removed" would wipe
    // the snapshot, so refuse to continue.
    throw new FatalError(
      "Parsed zero companies from the README — refusing to diff against an empty list",
    );
  }

  return companies;
}

async function createNewCompaniesSnapshot(
  companiesSlugs: string[],
): Promise<void> {
  "use step";

  const supabase = await createAdminClient();

  const { error } = await supabase.from("companies_snapshot").insert({
    slugs: companiesSlugs,
    snapshot_date: new Date().toISOString(),
  });

  if (error) {
    console.error("[weekly-digest] failed to create snapshot", error);
    throw error;
  }

  console.log(
    `[weekly-digest] created baseline snapshot with ${companiesSlugs.length} slugs`,
  );
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

async function updateCompaniesSnapshot(
  snapshotId: string | null,
  currentCompaniesSlugs: string[],
): Promise<void> {
  "use step";

  const supabase = await createAdminClient();

  if (!snapshotId) {
    throw new FatalError(
      "Latest companies snapshot ID not found, cannot update snapshot",
    );
  }

  const { error } = await supabase
    .from("companies_snapshot")
    .update({
      slugs: currentCompaniesSlugs,
      snapshot_date: new Date().toISOString(),
    })
    .eq("id", snapshotId);

  if (error) {
    console.error("[weekly-digest] failed to update snapshot", error);
    throw error;
  }

  console.log(
    `[weekly-digest] advanced snapshot ${snapshotId} to ${currentCompaniesSlugs.length} slugs`,
  );
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
