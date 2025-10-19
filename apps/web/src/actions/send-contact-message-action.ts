"use server";

import { emailService } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import arcjet, { request, slidingWindow } from "@arcjet/next";

// Per user rate limiter: 3 requests per day per user.
// This is to prevent abuse of the contact form.
const rateLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    slidingWindow({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      characteristics: ["userId"],
      interval: "24h", // 24 hour sliding window
      max: 3, // allow a maximum of 3 requests per day per IP address
    }),
  ],
});

export const sendContactMessageAction = async (formData: FormData) => {
  const supabase = await createClient();

  // Get the authenticated user's email from the server session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    throw new Error("User not authenticated");
  }

  const req = await request();
  const decision = await rateLimiter.protect(req, { userId: user.id });

  if (decision.isDenied())
    throw new Error("Rate limit exceeded. Please try again later.");

  const message = formData.get("message")?.toString().trim();

  if (!message || message.length === 0) {
    throw new Error("Message is required");
  }

  const escapedMessage = escapeString(message);
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!fromEmail || !toEmail) {
    throw new Error("Email configuration is missing");
  }

  const firstPartEmail = user.email.split("@")[0];

  await emailService.sendEmail({
    from: fromEmail,
    name: "Tech Companies Portugal",
    subject: "New message received — Tech Companies Portugal",
    body: `
  <p>Hello 👋</p>
  <p>You have received a new message through the <strong>Tech Companies Portugal</strong> website.</p>
  
  <p><strong>From:</strong> ${firstPartEmail}</p>
  
  <p><strong>Message:</strong></p>
  <blockquote style="border-left:3px solid #ccc;padding-left:8px;margin:10px 0;">
    <p>${escapedMessage}</p>
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

// Escape a string to prevent XSS attacks
const escapeString = (str: string) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
