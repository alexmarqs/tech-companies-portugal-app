import { getParsedCompaniesData } from "@/lib/parser/companies";
import { createAdminClient } from "@/lib/supabase/server";
import type { Company } from "@/lib/types";
import type { EventPayload } from "../events";
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
          .select("id, slugs")
          .order("snapshot_date", { ascending: false }) // most recent snapshot
          .limit(1); // only one snapshot

        if (error) {
          throw error;
        }

        return {
          id: data?.[0]?.id ?? null,
          slugs: data?.[0]?.slugs ?? [],
        };
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
    const [snapshotData, currentCompaniesData] = await Promise.all([
      snapshotCompaniesSlugsPromise,
      currentCompaniesDataPromise,
    ]);

    const currentCompaniesSlugs = currentCompaniesData.companies.map(
      (company: Company) => company.slug,
    );

    // if snapshot does not exist, create a new snapshot
    if (!snapshotData.id || snapshotData.slugs.length === 0) {
      await step.run("create-new-companies-snapshot", async () => {
        const { error } = await supabase.from("companies_snapshot").insert({
          slugs: currentCompaniesSlugs,
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
    const previousCompaniesSlugs = new Set(snapshotData.slugs);

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
      // Update snapshot even when no users are subscribed
      // to reflect that we checked this week
      await step.run("update-companies-snapshot-no-users", async () => {
        if (!snapshotData.id) {
          throw new Error("Snapshot ID not found");
        }

        const { error } = await supabase
          .from("companies_snapshot")
          .update({
            slugs: currentCompaniesSlugs,
            snapshot_date: new Date().toISOString(),
          })
          .eq("id", snapshotData.id);

        if (error) {
          throw error;
        }
      });

      return {
        message: "No subscribed users found.",
      };
    }

    const events: EventPayload<"weekly-new-companies-send-email-worker">[] = [];

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

    await step.sendEvent("fan-out-weekly-new-companies-send-email", events);

    await step.run("update-companies-snapshot", async () => {
      if (!snapshotData.id) {
        throw new Error("Snapshot ID not found");
      }

      const { error } = await supabase
        .from("companies_snapshot")
        .update({
          slugs: currentCompaniesSlugs,
          snapshot_date: new Date().toISOString(),
        })
        .eq("id", snapshotData.id);

      if (error) {
        throw error;
      }
    });

    return {
      message: `Weekly new companies cron completed. ${events.length} events sent to reach ${subscribedUsersNewCompaniesEmails.length} subscribed users.`,
    };
  },
);
