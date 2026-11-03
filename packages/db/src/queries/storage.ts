import type { DbClient } from "../types";

/** Public bucket, one folder per user id. */
export const AVATARS_BUCKET = "avatars";

/**
 * Uploads the user's avatar, replacing the previous one, and returns its
 * public URL. Storage RLS limits users to their own folder.
 */
export const uploadAvatarFile = async (
  supabase: DbClient,
  userId: string,
  file: File,
): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/avatar.${fileExt}`;
  const bucket = supabase.storage.from(AVATARS_BUCKET);

  // not adding cache control because we want to update the avatar immediately
  const { error } = await bucket.upload(filePath, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;

  return bucket.getPublicUrl(filePath).data.publicUrl;
};

/** Removes every file in the user's avatar folder. */
export const removeUserAvatars = async (supabase: DbClient, userId: string) => {
  const bucket = supabase.storage.from(AVATARS_BUCKET);

  const { data: files, error } = await bucket.list(userId);
  if (error) throw error;
  if (!files?.length) return;

  const { error: removeError } = await bucket.remove(
    files.map((file) => `${userId}/${file.name}`),
  );
  if (removeError) throw removeError;
};
