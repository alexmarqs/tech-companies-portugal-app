import { createAdminClient, createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const isLocalUrl = (url: string | undefined) =>
  !!url &&
  (url.startsWith("http://127.0.0.1") || url.startsWith("http://localhost"));

/**
 * Dev-only login for the local Supabase stack, where no OAuth provider is
 * configured (`pnpm run dev:local`). Creates/reuses a confirmed user for the
 * given email, verifies a magic-link token server-side (the app uses the PKCE
 * flow, so raw magic links in the browser don't complete), and sets the
 * session cookies. Manual testing and E2E specs sign in with one request:
 *
 *   GET /api/dev/login?email=someone@example.com[&next=/my-companies]
 *
 * 404s unless running `next dev` with both the API and admin clients pointed
 * at a local Supabase.
 */
export async function GET(request: Request) {
  if (
    process.env.NODE_ENV !== "development" ||
    !isLocalUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    !isLocalUrl(process.env.SUPABASE_URL)
  ) {
    return new NextResponse(null, { status: 404 });
  }

  const { searchParams, origin } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Missing ?email= query parameter" },
      { status: 400 },
    );
  }

  const admin = await createAdminClient();

  // Idempotent: creating an already-existing user fails, which is fine.
  await admin.auth.admin.createUser({ email, email_confirm: true });

  const { data, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkError || !data.properties?.hashed_token) {
    return NextResponse.json(
      { error: linkError?.message ?? "Could not generate login token" },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: data.properties.hashed_token,
  });

  if (verifyError) {
    return NextResponse.json({ error: verifyError.message }, { status: 500 });
  }

  return NextResponse.redirect(`${origin}${searchParams.get("next") ?? "/"}`);
}
