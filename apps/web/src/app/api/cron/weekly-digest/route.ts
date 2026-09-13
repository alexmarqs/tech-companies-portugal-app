import { weeklyDigestWorkflow } from "@/workflows/weekly-digest";
import { NextResponse } from "next/server";
import { start } from "workflow/api";

/**
 * Trigger for the weekly digest, replacing Inngest's built-in cron trigger.
 *
 * Scheduled by `vercel.json`; Vercel Cron sends `Authorization: Bearer
 * $CRON_SECRET`. `start()` enqueues the run and returns immediately, so this
 * handler stays well inside the cron invocation timeout regardless of how many
 * subscribers there are.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("[weekly-digest] CRON_SECRET is not set");
    return NextResponse.json(
      { error: "Cron is not configured" },
      { status: 500 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const run = await start(weeklyDigestWorkflow);

  console.log(`[weekly-digest] started run ${run.runId}`);

  return NextResponse.json({ runId: run.runId });
}
