import { updateSession } from "@tech-companies-portugal/supabase/middleware";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/login", "/settings/:path*"],
};
