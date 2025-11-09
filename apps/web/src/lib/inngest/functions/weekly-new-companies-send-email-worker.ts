import { emailService } from "@/lib/email";
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

    const emailBody = `
      <p>Hello 👋</p>
      <p>We have <strong>${newCompanies.length} new ${newCompanies.length === 1 ? "company" : "companies"}</strong> added to Tech Companies Portugal this week!</p>
      
      <h2>New Companies:</h2>
      <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">${companiesList}</pre>
      
      <p>
        <a href="https://techcompaniesportugal.fyi" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Explore Companies →
        </a>
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 12px; color: #666;">
        You're receiving this because you subscribed to new company notifications. 
        <a href="https://techcompaniesportugal.fyi/settings">Manage your preferences</a>.
      </p>
    `;

    await step.run("send-email", async () => {
      await emailService.sendEmail({
        to: emails,
        subject: `🚀 ${newCompanies.length} New ${newCompanies.length === 1 ? "Company" : "Companies"} Added This Week`,
        body: emailBody,
      });
    });

    return {
      message: "Emails sent successfully",
      recipientsCount: emails.length,
      companiesCount: newCompanies.length,
    };
  },
);
