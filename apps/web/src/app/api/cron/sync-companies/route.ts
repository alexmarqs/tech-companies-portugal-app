import { verifyCronRequest } from "@/lib/cron";
import { syncCompaniesWorkflow } from "@/workflows/sync-companies";
import { NextResponse } from "next/server";
import { start } from "workflow/api";

/**
 * Daily trigger to sync companies from sources to the database.
 */
export async function GET(request: Request) {
  const unauthorized = verifyCronRequest(request, "sync-companies");

  if (unauthorized) {
    return unauthorized;
  }

  const run = await start(syncCompaniesWorkflow);

  console.log(`[sync-companies] started run ${run.runId}`);

  return NextResponse.json({ runId: run.runId });
}
