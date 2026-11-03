import type { Enums, Tables } from "@tech-companies-portugal/db/types";

export type UserProfile = Tables<"users">;
export type NotificationSetting = Tables<"notification_settings">;

/** The only profile fields a user may change. */
export type UserProfilePatch = {
  full_name?: string;
  avatar_url?: string | null;
};

export type NotificationSettingInput = {
  type: Enums<"notification_type">;
  channel: Enums<"notification_channel">;
  enabled: boolean;
};

export type UsersRepository = {
  getProfile: (userId: string) => Promise<UserProfile>;
  updateProfile: (userId: string, patch: UserProfilePatch) => Promise<void>;
  listNotificationSettings: (userId: string) => Promise<NotificationSetting[]>;
  /** Upserts on (user, channel, type). */
  upsertNotificationSetting: (
    userId: string,
    setting: NotificationSettingInput,
  ) => Promise<NotificationSetting>;
  /** Deletes the auth user; the database cascades to every user-owned row. */
  deleteUser: (userId: string) => Promise<void>;
};
