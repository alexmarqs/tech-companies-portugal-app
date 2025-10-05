import { getPlunkClient } from "./client";
import type { EmailService } from "./types";
import { DEFAULT_EMAIL_FROM, DEFAULT_EMAIL_NAME } from "./utils";

const sendEmail: EmailService["sendEmail"] = async (payload) => {
  const {
    body,
    from = DEFAULT_EMAIL_FROM,
    name = DEFAULT_EMAIL_NAME,
    subscribed,
    subject,
    to,
  } = payload;

  try {
    await getPlunkClient().emails.send({
      body,
      from,
      name,
      subscribed,
      type: "html",
      subject,
      to,
    });
  } catch (error) {
    console.error("Failed to send email", {
      from,
      name,
      subscribed,
      subject,
      to,
    });
    throw error instanceof Error ? error : new Error("Unknown email error");
  }
};

export const emailService: EmailService = {
  sendEmail,
};
