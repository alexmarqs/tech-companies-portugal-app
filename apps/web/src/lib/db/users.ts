import { createClient } from "@/lib/supabase/client";
import type { Tables } from "../supabase/database.types";

export const getUserProfile = async (): Promise<Tables<"users">> => {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.from("users").select("*").single();
    // not needed as we are using RLS to protect the users table and only the user can see their own profile
    //.eq("id", userId)
    //.single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user profile", error);
    throw error;
  }
};
