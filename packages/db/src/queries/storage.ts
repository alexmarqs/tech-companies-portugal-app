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
  // From the MIME type, not the file name: names can lack an extension or hold
  // spaces, which the API's avatar URL check rejects.
  const fileExt = file.type.split("/")[1]?.replace(/\W/g, "") || "img";
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

/** Public bucket, one `<slug>.png` per company. */
export const COMPANY_LOGOS_BUCKET = "company-logos";

/**
 * Uploads a company's PNG logo, replacing the previous one, and returns its
 * public URL. Cached for a year, so callers version the URL they store.
 */
export const uploadCompanyLogoFile = async (
  supabase: DbClient,
  slug: string,
  image: Uint8Array,
): Promise<string> => {
  const filePath = `${slug}.png`;
  const bucket = supabase.storage.from(COMPANY_LOGOS_BUCKET);

  const { error } = await bucket.upload(filePath, image, {
    contentType: "image/png",
    upsert: true,
    cacheControl: "31536000, immutable",
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
