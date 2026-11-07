import {
  AVATARS_BUCKET,
  removeUserAvatars,
} from "@tech-companies-portugal/db/queries";
import { createAdminClient } from "@tech-companies-portugal/db/server";
import type { AvatarStorage } from "./types";

/** One plain file name (`avatar.png`), never a path or an encoded segment. */
const AVATAR_FILE_NAME = /^[\w-]+(\.[\w-]+)*$/;

/** Avatars live in the public `avatars` bucket, one folder per user id. */
export const createSupabaseAvatarStorage = (): AvatarStorage => ({
  /**
   * Parsed, not prefix-matched: `<uid>/../<other>/x.png` would pass a
   * `startsWith` check.
   */
  isOwnUrl(url, userId) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || !URL.canParse(url)) return false;

    const { origin, pathname } = new URL(url);
    const folder = `/storage/v1/object/public/${AVATARS_BUCKET}/${userId}/`;
    if (
      origin !== new URL(supabaseUrl).origin ||
      !pathname.startsWith(folder)
    ) {
      return false;
    }
    return AVATAR_FILE_NAME.test(pathname.slice(folder.length));
  },

  async removeAllForUser(userId) {
    try {
      await removeUserAvatars(await createAdminClient(), userId);
    } catch (error) {
      throw new Error("[SupabaseAvatarStorage] Error removing user avatars", {
        cause: error,
      });
    }
  },
});
