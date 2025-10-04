import WelcomeEmail from "@/emails/templates/welcome";
import { emailService } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import { render } from "@react-email/components";
import { waitUntil } from "@vercel/functions";
import { differenceInSeconds } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in params, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      // if the user was created in the last 15 seconds, send the welcome email
      if (
        data?.session?.user.created_at &&
        differenceInSeconds(
          new Date(),
          new Date(data.session.user.created_at),
        ) < 15 &&
        data?.session?.user.email
      ) {
        // this will be run in the background
        waitUntil(
          sendWelcomeEmail(
            data?.session?.user.email,
            data?.session?.user.user_metadata.full_name,
          ),
        );
      }

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      }

      if (forwardedHost) {
        // in case we user load balancer or proxy, we need to redirect to the correct host
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    // if there is an error, redirect to the auth code error page with possible instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}

const sendWelcomeEmail = async (email: string, name: string) => {
  const emailHtml = await render(
    WelcomeEmail({
      userFirstname: name,
    }),
  );

  emailService.sendEmail({
    to: email,
    // Default is: Tech Companies Portugal <hello@techcompaniesportugal.fyi>
    subject: "Welcome to Tech Companies Portugal",
    body: emailHtml,
  });
};
