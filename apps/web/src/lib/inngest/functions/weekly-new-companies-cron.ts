import { getParsedCompaniesData } from "@/lib/parser/companies";
import { createAdminClient } from "@/lib/supabase/server";
import type { Company } from "@/lib/types";
import { inngest } from "../inngest-client";

const BATCH_SIZE = 50;

export const weeklyNewCompaniesLoadCron = inngest.createFunction(
  {
    id: "weekly-new-companies-load-cron",
    retries: 1,
  },
  { cron: "TZ=Europe/Lisbon 0 9 * * MON" }, // Every Monday at 9:00 AM @ Lisbon time
  async ({ step }) => {
    const supabase = await createAdminClient();

    const snapshotCompaniesSlugsPromise = step.run(
      "get-last-companies-snapshot",
      async () => {
        const { data, error } = await supabase
          .from("companies_snapshot")
          .select("slugs")
          .order("snapshot_date", { ascending: false }) // most recent snapshot
          .limit(1); // only one snapshot

        if (error) {
          throw error;
        }

        return data?.[0]?.slugs ?? [];
      },
    );

    const currentCompaniesDataPromise = step.run(
      "get-current-companies-data",
      async () => {
        const data = await getParsedCompaniesData();
        return data;
      },
    );

    // Run the steps in parallel
    const [snapshotCompaniesSlugs, currentCompaniesData] = await Promise.all([
      snapshotCompaniesSlugsPromise,
      currentCompaniesDataPromise,
    ]);

    // if snapshot does not exist, create a new snapshot
    if (snapshotCompaniesSlugs.length === 0) {
      await step.run("create-new-companies-snapshot", async () => {
        const { error } = await supabase.from("companies_snapshot").insert({
          slugs: currentCompaniesData.companies.map(
            (company: Company) => company.slug,
          ),
          snapshot_date: new Date().toISOString(),
        });

        if (error) {
          throw error;
        }
      });

      return {
        message: "New companies snapshot created.",
      };
    }

    // get diff of current companies and snapshot companies using slugs:
    const previousCompaniesSlugs = new Set(snapshotCompaniesSlugs);

    const newCompanies = currentCompaniesData.companies
      .map((company: Company) => {
        return {
          slug: company.slug,
          name: company.name,
        };
      })
      .filter(
        (company: { slug: string; name: string }) =>
          !previousCompaniesSlugs.has(company.slug),
      );

    if (newCompanies.length === 0) {
      return {
        message: "No new companies found.",
      };
    }

    const subscribedUsersNewCompaniesEmails = await step.run(
      "get-subscribed-users-new-companies-emails",
      async () => {
        const { data, error } = await supabase
          .from("notification_settings")
          .select("users (email)")
          .eq("type", "new_companies")
          .eq("channel", "email")
          .eq("enabled", true);

        if (error) {
          throw error;
        }

        return (
          data
            ?.map((notificationSetting) => notificationSetting.users?.email)
            .filter(Boolean) ?? []
        );
      },
    );

    if (subscribedUsersNewCompaniesEmails.length === 0) {
      return {
        message: "No subscribed users found.",
      };
    }

    // Batch emails into groups and send one event per batch
    // Each event will send emails to multiple recipients in a single API call
    const events = [];
    for (
      let i = 0;
      i < subscribedUsersNewCompaniesEmails.length;
      i += BATCH_SIZE
    ) {
      const emailBatch = subscribedUsersNewCompaniesEmails.slice(
        i,
        i + BATCH_SIZE,
      );
      events.push({
        name: "weekly-new-companies-send-email-worker",
        data: {
          emails: emailBatch,
          newCompanies,
        },
      });
    }

    // Send events to fan-out, if batch size is greater than BATCH_SIZE, send in batches of BATCH_SIZE
    if (events?.length && events.length > BATCH_SIZE) {
      for (let i = 0; i < events.length; i += BATCH_SIZE) {
        const batch = events.slice(i, i + BATCH_SIZE);
        await step.sendEvent("fan-out-weekly-new-companies-send-email", batch);
      }
    } else {
      await step.sendEvent("fan-out-weekly-new-companies-send-email", events);
    }

    return {
      message: `Weekly new companies cron completed. ${events.length} events sent to reach ${subscribedUsersNewCompaniesEmails.length} subscribed users.`,
    };
  },
);
