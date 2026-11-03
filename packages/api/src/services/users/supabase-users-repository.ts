import {
  deleteAuthUser,
  getNotificationSettingsByUserId,
  getUserProfileById,
  updateUserProfileById,
  upsertNotificationSetting,
} from "@tech-companies-portugal/db/queries";
import { createAdminClient } from "@tech-companies-portugal/db/server";
import type { UsersRepository } from "./types";

export const createSupabaseUsersRepository = (): UsersRepository => ({
  async getProfile(userId) {
    try {
      return await getUserProfileById(await createAdminClient(), userId);
    } catch (error) {
      throw new Error("[SupabaseUsersRepository] Error getting user profile", {
        cause: error,
      });
    }
  },

  async updateProfile(userId, patch) {
    try {
      await updateUserProfileById(await createAdminClient(), userId, patch);
    } catch (error) {
      throw new Error("[SupabaseUsersRepository] Error updating user profile", {
        cause: error,
      });
    }
  },

  async listNotificationSettings(userId) {
    try {
      return await getNotificationSettingsByUserId(
        await createAdminClient(),
        userId,
      );
    } catch (error) {
      throw new Error(
        "[SupabaseUsersRepository] Error listing notification settings",
        { cause: error },
      );
    }
  },

  async upsertNotificationSetting(userId, setting) {
    try {
      return await upsertNotificationSetting(await createAdminClient(), {
        ...setting,
        user_id: userId,
      });
    } catch (error) {
      throw new Error(
        "[SupabaseUsersRepository] Error upserting notification setting",
        { cause: error },
      );
    }
  },

  async deleteUser(userId) {
    try {
      await deleteAuthUser(await createAdminClient(), userId);
    } catch (error) {
      throw new Error("[SupabaseUsersRepository] Error deleting user", {
        cause: error,
      });
    }
  },
});
