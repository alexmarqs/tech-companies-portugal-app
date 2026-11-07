import type {
  NotificationSetting,
  NotificationSettingInput,
  UserProfile,
  UserProfilePatch,
} from "../../services/users/types";

/**
 * Owned by users, implemented by the api-keys module in the composition
 * root, so this module never depends on api-keys.
 */
export type UserApiKeysRevoker = {
  /** Revokes every key the user holds; they stop authenticating immediately. */
  revokeAllForUser: (userId: string) => Promise<void>;
};

export type UsersUseCases = {
  getProfileUseCase: (userId: string) => Promise<UserProfile>;
  /** Throws `ValidationError` for an avatar outside the user's own folder. */
  updateProfileUseCase: (
    userId: string,
    patch: UserProfilePatch,
  ) => Promise<void>;
  listNotificationSettingsUseCase: (
    userId: string,
  ) => Promise<NotificationSetting[]>;
  upsertNotificationSettingUseCase: (
    userId: string,
    setting: NotificationSettingInput,
  ) => Promise<NotificationSetting>;
  /** Deletes the account with its avatar files and revokes its API keys. */
  deleteAccountUseCase: (userId: string) => Promise<void>;
};
