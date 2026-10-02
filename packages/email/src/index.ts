import { getPlunkClient } from "./plunk-email-client";
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
    console.error("Failed to send email", error);
    throw error instanceof Error ? error : new Error("Unknown email error");
  }
};

export const emailService: EmailService = {
  sendEmail,
};

export { render } from "@react-email/render";
export type { EmailService, EmailServiceParams } from "./types";
export {
  DEFAULT_EMAIL_FROM,
  DEFAULT_EMAIL_FROM_NOTIFICATIONS,
  DEFAULT_EMAIL_NAME,
} from "./utils";
