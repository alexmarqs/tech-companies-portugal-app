import { getPlunkClient } from "./client";
import type { EmailService } from "./types";
import { DEFAULT_EMAIL_FROM, normalizeRecipients } from "./utils";

const sendEmail: EmailService["sendEmail"] = async (payload) => {
  const {
    body,
    from = DEFAULT_EMAIL_FROM,
    name,
    subscribed,
    subject,
    to,
  } = payload;

  const recipients = normalizeRecipients(to);

  try {
    await getPlunkClient().emails.send({
      body,
      from,
      name,
      subscribed,
      subject,
      to: recipients,
    });
  } catch (error) {
    console.error("Failed to send email", error);
    throw error instanceof Error ? error : new Error("Unknown email error");
  }
};

export const emailService: EmailService = {
  sendEmail,
};
