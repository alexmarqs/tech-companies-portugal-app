import {
  countActiveApiKeysForUser,
  deleteInactiveApiKey,
  getActiveApiKeyByHash,
  getApiKeysForUser,
  insertApiKey,
  markApiKeyUsed,
  revokeApiKey,
  revokeApiKeysForUser,
} from "@tech-companies-portugal/db/queries";
import { createAdminClient } from "@tech-companies-portugal/db/server";
import type { ApiKeysRepository } from "./types";

export const createSupabaseApiKeysRepository = (): ApiKeysRepository => ({
  async findActiveByHash(keyHash) {
    try {
      const row = await getActiveApiKeyByHash(
        await createAdminClient(),
        keyHash,
      );
      if (!row) return null;

      return {
        id: row.id,
        userId: row.user_id,
        keyPrefix: row.key_prefix,
        permission: row.permission,
        rateLimitPerMinute: row.rate_limit_per_minute,
        expiresAt: row.expires_at,
      };
    } catch (error) {
      throw new Error("[SupabaseApiKeysRepository] Error finding API key", {
        cause: error,
      });
    }
  },

  async listForUser(userId) {
    try {
      return await getApiKeysForUser(await createAdminClient(), userId);
    } catch (error) {
      throw new Error("[SupabaseApiKeysRepository] Error listing API keys", {
        cause: error,
      });
    }
  },

  async countActiveForUser(userId) {
    try {
      return await countActiveApiKeysForUser(await createAdminClient(), userId);
    } catch (error) {
      throw new Error(
        "[SupabaseApiKeysRepository] Error counting active API keys",
        { cause: error },
      );
    }
  },

  async markUsed(id) {
    try {
      await markApiKeyUsed(await createAdminClient(), id);
    } catch (error) {
      throw new Error(
        "[SupabaseApiKeysRepository] Error marking API key used",
        {
          cause: error,
        },
      );
    }
  },

  async insert(apiKey) {
    try {
      const { id } = await insertApiKey(await createAdminClient(), {
        user_id: apiKey.userId,
        name: apiKey.name,
        key_prefix: apiKey.keyPrefix,
        key_hash: apiKey.keyHash,
        permission: apiKey.permission,
        rate_limit_per_minute: apiKey.rateLimitPerMinute,
        expires_at: apiKey.expiresAt,
      });
      return { id };
    } catch (error) {
      throw new Error("[SupabaseApiKeysRepository] Error inserting API key", {
        cause: error,
      });
    }
  },

  async revoke(input) {
    try {
      return await revokeApiKey(await createAdminClient(), input);
    } catch (error) {
      throw new Error("[SupabaseApiKeysRepository] Error revoking API key", {
        cause: error,
      });
    }
  },

  async deleteInactive(input) {
    try {
      return await deleteInactiveApiKey(await createAdminClient(), input);
    } catch (error) {
      throw new Error("[SupabaseApiKeysRepository] Error deleting API key", {
        cause: error,
      });
    }
  },

  async revokeAllForUser(userId) {
    try {
      return await revokeApiKeysForUser(await createAdminClient(), userId);
    } catch (error) {
      throw new Error(
        "[SupabaseApiKeysRepository] Error revoking all API keys for user",
        { cause: error },
      );
    }
  },
});
