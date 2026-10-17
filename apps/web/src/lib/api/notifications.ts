import {
  getNotificationSettingsByUserId,
  upsertNotificationSetting,
} from "@tech-companies-portugal/db/queries";
import type { Tables, TablesInsert } from "@tech-companies-portugal/db/types";
import { getSessionClient } from "./session";

export const getUserNotificationSettings = async (): Promise<
  Tables<"notification_settings">[]
> => {
  const { supabase, userId } = await getSessionClient();

  return getNotificationSettingsByUserId(supabase, userId);
};

export const upsertUserNotificationSetting = async ({
  setting,
}: {
  setting: TablesInsert<"notification_settings">;
}): Promise<void> => {
  const { supabase, userId } = await getSessionClient();

  await upsertNotificationSetting(supabase, { ...setting, user_id: userId });
};
