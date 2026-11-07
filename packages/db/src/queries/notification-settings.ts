import type { DbClient, Enums, Tables, TablesInsert } from "../types";

export const getNotificationSettingsByUserId = async (
  supabase: DbClient,
  userId: string,
): Promise<Tables<"notification_settings">[]> => {
  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return data;
};

/** Upserts on (user_id, channel, type), so callers never pass a row id. */
export const upsertNotificationSetting = async (
  supabase: DbClient,
  setting: Pick<
    TablesInsert<"notification_settings">,
    "user_id" | "type" | "channel" | "enabled"
  >,
): Promise<Tables<"notification_settings">> => {
  const { data, error } = await supabase
    .from("notification_settings")
    .upsert(setting, { onConflict: "user_id,channel,type" })
    .select("*")
    .single();

  if (error) throw error;

  return data;
};

/** Unique, non-empty emails of users with this notification enabled. */
export const getSubscribedUserEmails = async (
  supabase: DbClient,
  {
    type,
    channel,
  }: {
    type: Enums<"notification_type">;
    channel: Enums<"notification_channel">;
  },
): Promise<string[]> => {
  const { data, error } = await supabase
    .from("notification_settings")
    .select("users (email)")
    .eq("type", type)
    .eq("channel", channel)
    .eq("enabled", true);

  if (error) throw error;

  const emails = data
    .map((notificationSetting) => notificationSetting.users?.email)
    .filter(
      (email): email is string => typeof email === "string" && email.length > 0,
    );

  return Array.from(new Set(emails));
};
