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

  const message = formData.get("message")?.toString().trim() as string;

  await emailService.sendEmail({
    body: message,
    from: process.env.CONTACT_FROM_EMAIL!,
    name: "Tech Companies Portugal",
    subject: `Contact Form - ${user.email}`,
    to: process.env.CONTACT_TO_EMAIL!,
  });
};
