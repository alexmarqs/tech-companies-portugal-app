import type { z } from "@hono/zod-openapi";
import type {
  NotificationSetting,
  UserProfile,
} from "../../../services/users/types";
import type { NotificationSettingSchema, UserProfileSchema } from "./schemas";

export const toUserProfileResponse = (
  profile: UserProfile,
): z.infer<typeof UserProfileSchema> => ({
  id: profile.id,
  email: profile.email,
  full_name: profile.full_name ?? undefined,
  avatar_url: profile.avatar_url ?? undefined,
  created_at: profile.created_at,
  updated_at: profile.updated_at,
});

export const toNotificationSettingResponse = (
  setting: NotificationSetting,
): z.infer<typeof NotificationSettingSchema> => ({
  id: setting.id,
  user_id: setting.user_id,
  type: setting.type,
  channel: setting.channel,
  enabled: setting.enabled,
  created_at: setting.created_at,
  updated_at: setting.updated_at,
});
