"use server";

import { emailService } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export const sendContactMessageAction = async (formData: FormData) => {
  // TODO: Rate limit

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

  const firstPartEmail = user.email.split("@")[0];
  const fullName = user.user_metadata?.full_name;

  await emailService.sendEmail({
    from: fromEmail,
    name: "Tech Companies Portugal",
    subject: "New message received — Tech Companies Portugal",
    body: `
  <p>Hello 👋</p>
  <p>You have received a new message through the <strong>Tech Companies Portugal</strong> website.</p>
  
  <p><strong>From:</strong> ${firstPartEmail}${fullName ? ` (${fullName})` : ""}</p>
  
  <p><strong>Message:</strong></p>
  <blockquote style="border-left:3px solid #ccc;padding-left:8px;margin:10px 0;">
    <p>${message}</p>
  </blockquote>
  
  <hr>
  <p style="font-size:12px;color:#666;">
  Automated message from Tech Companies Portugal — ${new Date().toLocaleDateString()}.
  </p>
  `,
    to: toEmail,
  });

  return { success: true };
};
