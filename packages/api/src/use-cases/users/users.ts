import type { AvatarStorage } from "../../services/avatars/types";
import type { UsersRepository } from "../../services/users/types";
import { ValidationError } from "../errors";
import type { UserApiKeysRevoker, UsersUseCases } from "./types";

const INVALID_AVATAR_MESSAGE =
  "The avatar must be uploaded to your own avatar folder.";

export const createUsersUseCases = ({
  usersRepository,
  avatarStorage,
  apiKeysRevoker,
}: {
  usersRepository: UsersRepository;
  avatarStorage: AvatarStorage;
  apiKeysRevoker: UserApiKeysRevoker;
}): UsersUseCases => ({
  getProfileUseCase(userId) {
    return usersRepository.getProfile(userId);
  },

  async updateProfileUseCase(userId, patch) {
    if (patch.avatar_url && !avatarStorage.isOwnUrl(patch.avatar_url, userId)) {
      throw new ValidationError(INVALID_AVATAR_MESSAGE, [
        {
          code: "invalid_avatar_url",
          message: INVALID_AVATAR_MESSAGE,
          path: "avatar_url",
        },
      ]);
    }

    await usersRepository.updateProfile(userId, patch);
  },

  listNotificationSettingsUseCase(userId) {
    return usersRepository.listNotificationSettings(userId);
  },

  upsertNotificationSettingUseCase(userId, setting) {
    return usersRepository.upsertNotificationSetting(userId, setting);
  },

  async deleteAccountUseCase(userId) {
    // Before the delete: Supabase refuses to delete a user who still owns
    // Storage objects. Should a later step fail, the avatar just falls back to
    // initials. Best effort, so the delete reports any real blocker.
    try {
      await avatarStorage.removeAllForUser(userId);
    } catch (error) {
      console.warn("Unable to remove avatar files", { userId, error });
    }

    // Before the delete, whose cascade removes the rows holding the digests.
    // Should the delete then fail, the account stays without working keys.
    await apiKeysRevoker.revokeAllForUser(userId);

    await usersRepository.deleteUser(userId);
  },
});
