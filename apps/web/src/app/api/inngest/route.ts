import { weeklyNewCompaniesLoadCron } from "@/lib/inngest/functions/weekly-new-companies-cron";
import { inngest } from "@/lib/inngest/inngest-client";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [weeklyNewCompaniesLoadCron],
});
