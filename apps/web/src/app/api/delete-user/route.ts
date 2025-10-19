import { createAdminClient, createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    const user = data?.claims;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    try {
      const { data: files, error: listError } = await supabaseAdmin.storage
        .from("avatars")
        .list(user.sub);

      if (!listError && files && files.length > 0) {
        const pathsToRemove = files.map((f) => `${user.sub}/${f.name}`);
        await supabaseAdmin.storage.from("avatars").remove(pathsToRemove);
      }
    } catch {}

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.sub);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return new Response(null, { status: 204 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
