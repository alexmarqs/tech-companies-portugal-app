import WeeklyNewCompaniesEmail from "@/emails/templates/weekly-new-companies";
import { emailService } from "@/lib/email";
import { DEFAULT_EMAIL_FROM_NOTIFICATIONS } from "@/lib/email/utils";
import { render } from "@react-email/render";
import { inngest } from "../inngest-client";

export const weeklyNewCompaniesSendEmailWorker = inngest.createFunction(
  {
    id: "weekly-new-companies-send-email-worker",
    throttle: {
      limit: 2,
      period: "1s",
    },
    concurrency: 3,
    retries: 1,
  },
  { event: "app/weekly.new.companies.send.email.worker" },
  async ({ event, step }) => {
    const { emails, newCompanies } = event.data;

    if (
      !emails ||
      !Array.isArray(emails) ||
      emails.length === 0 ||
      !newCompanies ||
      newCompanies.length === 0
    ) {
      return {
        message: "Skipped: missing emails or no new companies",
        emailsCount: Array.isArray(emails) ? emails.length : 0,
      };
    }

    console.log(`Processing batch of ${emails.length} emails`);

    // Generate email content
    const companiesList = newCompanies
      .map((company) => `• ${company.name}`)
      .join("\n");

    await step.run("send-email", async () => {
      const emailHtml = await render(
        WeeklyNewCompaniesEmail({
          newCompanies,
        }),
      );

      await emailService.sendEmail({
        to: emails,
        from: DEFAULT_EMAIL_FROM_NOTIFICATIONS,
        subject: `Weekly Report | ${newCompanies.length} New ${newCompanies.length === 1 ? "Company" : "Companies"} Added This Week`,
        body: emailHtml,
      });
    });

    return {
      message: "Emails sent successfully",
      recipientsCount: emails.length,
      companiesCount: newCompanies.length,
    };
  },
);
