"use server";

import { emailService } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export const sendContactMessageAction = async (formData: FormData) => {
  // TODO: Add here arcjet rate limiting rule protection, e.g. 10 requests per minute

  const supabase = await createClient();

  // Get the authenticated user's email from the server session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    throw new Error("User not authenticated");
  }

  const message = formData.get("message")?.toString().trim();

  if (!message || message.length === 0) {
    throw new Error("Message is required");
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!fromEmail || !toEmail) {
    throw new Error("Email configuration is missing");
  }

  await emailService.sendEmail({
    body: `<p>Message from ${user.email}:</p><p>${message}</p>`,
    from: fromEmail,
    name: "Tech Companies Portugal",
    subject: `Talk to us message from ${user.email}`,
    to: toEmail,
  });

  return { success: true };
};
