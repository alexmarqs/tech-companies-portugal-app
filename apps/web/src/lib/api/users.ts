import {
  getUserProfileById,
  updateUserProfileById,
} from "@tech-companies-portugal/db/queries";
import type { Tables, TablesUpdate } from "@tech-companies-portugal/db/types";
import { getSessionClient } from "./session";

export const getUserProfile = async (): Promise<Tables<"users">> => {
  const { supabase, userId } = await getSessionClient();

  return getUserProfileById(supabase, userId);
};

export const updateUserProfile = async ({
  data,
}: {
  data: TablesUpdate<"users">;
}): Promise<void> => {
  const { supabase, userId } = await getSessionClient();

  await updateUserProfileById(supabase, userId, data);
};

export const deleteUser = async (): Promise<void> => {
  try {
    // Only signed-in users can delete their account.
    await getSessionClient();

    const response = await fetch("/api/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};

export const uploadUserAvatar = async ({
  file,
}: {
  file: File;
}): Promise<{ publicUrl: string }> => {
  try {
    const { supabase, userId } = await getSessionClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `avatar.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload new file
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      // not adding cache control because we want to update the avatar immediately
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    // Get public URL. The path is the same on every upload, so version it:
    // an unchanged `avatar_url` would keep showing the browser-cached image.
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = `${data.publicUrl}?v=${Date.now()}`;

    // Update user profile table
    await updateUserProfileById(supabase, userId, { avatar_url: publicUrl });

    return { publicUrl };
  } catch (error) {
    console.error("Error uploading avatar", error);
    throw error;
  }
};
