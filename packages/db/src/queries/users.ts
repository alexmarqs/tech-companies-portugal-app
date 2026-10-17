import type { DbClient, Tables, TablesUpdate } from "../types";

export const getUserProfileById = async (
  supabase: DbClient,
  userId: string,
): Promise<Tables<"users">> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile", error);
    throw error;
  }

  return data;
};

export const updateUserProfileById = async (
  supabase: DbClient,
  userId: string,
  data: TablesUpdate<"users">,
): Promise<void> => {
  const { error } = await supabase.from("users").update(data).eq("id", userId);

  if (error) {
    console.error("Error updating user profile", error);
    throw error;
  }
};
