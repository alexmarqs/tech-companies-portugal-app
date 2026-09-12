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
    const { email, newCompanies } = event.data;

    if (
      !email ||
      !newCompanies ||
      !Array.isArray(newCompanies) ||
      newCompanies.length === 0
    ) {
      return {
        message: "Skipped: missing email or no new companies",
        companiesCount: Array.isArray(newCompanies) ? newCompanies.length : 0,
      };
    }

    await step.run("send-email", async () => {
      const companyLabel = newCompanies.length === 1 ? "company" : "companies";
      const emailHtml = await render(
        WeeklyNewCompaniesEmail({
          newCompanies,
        }),
      );

      await emailService.sendEmail({
        to: email,
        from: DEFAULT_EMAIL_FROM_NOTIFICATIONS,
        subject: `${newCompanies.length} new ${companyLabel} on the Portugal tech map`,
        body: emailHtml,
      });
    });

    return {
      message: "Email sent successfully",
      companiesCount: newCompanies.length,
    };
  },
);
