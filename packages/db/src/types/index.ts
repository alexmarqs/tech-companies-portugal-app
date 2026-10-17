import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export * from "./database.types";
export type { Session, User } from "@supabase/supabase-js";

/** Any typed client: browser, server or admin (service role). */
export type DbClient = SupabaseClient<Database>;
