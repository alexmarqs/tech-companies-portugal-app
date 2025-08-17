import { createClient } from "@/lib/supabase/client";
import type { Tables, TablesUpdate } from "../supabase/database.types";

export const getUserProfile = async (): Promise<Tables<"users">> => {
  try {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user.id) {
      throw new Error("Cannot get user session");
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user profile", error);
    throw error;
  }
};

export const updateUserProfile = async ({
  data,
}: {
  data: TablesUpdate<"users">;
}): Promise<void> => {
  try {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user.id) {
      throw new Error("Cannot get user session");
    }

    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", session.user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating user profile", error);
    throw error;
  }
};

export const deleteUser = async (): Promise<void> => {
  try {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user.id) {
      throw new Error("Cannot get user session");
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", session.user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};
