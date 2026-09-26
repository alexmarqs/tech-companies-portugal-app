import { NextResponse } from "next/server";

/**
 * Checks the `Authorization: Bearer $CRON_SECRET` header Vercel Cron sends.
 * Returns an error response to send back, or `null` when authorized.
 */
export const verifyCronRequest = (request: Request, jobName: string) => {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error(`[${jobName}] CRON_SECRET is not set`);
    return NextResponse.json(
      { error: "Cron is not configured" },
      { status: 500 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
};
