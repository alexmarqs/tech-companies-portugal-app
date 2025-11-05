import { inngest } from "../inngest-client";

export const weeklyNewCompaniesLoadCron = inngest.createFunction(
  {
    id: "weekly-new-companies-load-cron",
    retries: 1,
  },
  { cron: "TZ=Europe/Lisbon 0 9 * * MON" }, // Run every Monday at 9:00 AM @ Lisbon time
  async ({ event, step, attempt }) => {
    console.log("Weekly new companies load cron", { event, step, attempt });

    // load companies data / snapshot

    // load subscribed users

    // fan out batch of events - fan-out-weekly-new-companies
    return { message: `CRON ${event.data.email}!` };
  },
);
