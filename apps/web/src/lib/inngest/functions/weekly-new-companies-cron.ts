import { getParsedCompaniesData } from "@/lib/parser/companies";
import { createAdminClient } from "@/lib/supabase/server";
import type { Company } from "@/lib/types";
import type { EventPayload } from "../events";
import { inngest } from "../inngest-client";

const INNGEST_EVENT_BATCH_SIZE = 50;

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

        const emails =
          data
            ?.map((notificationSetting) => notificationSetting.users?.email)
            .filter(
              (email): email is string =>
                typeof email === "string" && email.length > 0,
            ) ?? [];

        return Array.from(new Set(emails));
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

    // One event per recipient. Plunk rejects transactional sends addressed to
    // more than 5 people at once, a shared `to` array would expose every
    // subscriber's address to the others, and this way one bad address cannot
    // fail everyone else's email.
    const events: EventPayload<"app/weekly.new.companies.send.email.worker">[] =
      subscribedUsersNewCompaniesEmails.map((email) => ({
        name: "app/weekly.new.companies.send.email.worker",
        data: {
          email,
          newCompanies,
        },
      }));

    for (
      let index = 0;
      index < events.length;
      index += INNGEST_EVENT_BATCH_SIZE
    ) {
      const batchNumber = index / INNGEST_EVENT_BATCH_SIZE + 1;
      await step.sendEvent(
        `fan-out-weekly-new-companies-send-email-${batchNumber}`,
        events.slice(index, index + INNGEST_EVENT_BATCH_SIZE),
      );
    }

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
      message: `Weekly new companies cron completed. ${events.length} recipient events sent in ${Math.ceil(events.length / INNGEST_EVENT_BATCH_SIZE)} batches.`,
    };
  },
);
