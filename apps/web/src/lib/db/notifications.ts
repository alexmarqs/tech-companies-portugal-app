import { createClient } from "../supabase/client";
import type { Tables, TablesInsert } from "../supabase/database.types";

export const getUserNotificationSettings = async (): Promise<
  Tables<"notification_settings">[]
> => {
  try {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user.id) {
      throw new Error("Cannot get user session");
    }

    const { data, error } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user notification settings", error);
    throw error;
  }
};

export const upsertUserNotificationSetting = async ({
  setting,
}: {
  setting: TablesInsert<"notification_settings">;
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
      .from("notification_settings")
      .upsert({ ...setting, user_id: session.user.id });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error upserting user notification setting", error);
    throw error;
  }
};
