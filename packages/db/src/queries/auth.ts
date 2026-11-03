import type { DbClient } from "../types";

/** Deletes the Auth user; needs the admin (service role) client. */
export const deleteAuthUser = async (supabase: DbClient, userId: string) => {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
};
