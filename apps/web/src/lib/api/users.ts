import type {
  InferRequestType,
  InferResponseType,
} from "@tech-companies-portugal/api/internal-client";
import { uploadAvatarFile } from "@tech-companies-portugal/db/queries";
import { internalApi, throwApiError } from "./internal-client";
import { getSessionClient } from "./session";

const meApiClient = internalApi.me;

export type UserProfile = InferResponseType<typeof meApiClient.$get, 200>;
export type UpdateUserProfileBody = InferRequestType<
  typeof meApiClient.$patch
>["json"];

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await meApiClient.$get();
  if (response.status !== 200) {
    return throwApiError(response, "Failed to get user profile");
  }

  return response.json();
};

export const updateUserProfile = async ({
  data,
}: {
  data: UpdateUserProfileBody;
}): Promise<void> => {
  const response = await meApiClient.$patch({ json: data });
  if (response.status !== 204) {
    return throwApiError(response, "Failed to update user profile");
  }
};

export const deleteUser = async (): Promise<void> => {
  const response = await meApiClient.$delete();
  if (response.status !== 204) {
    return throwApiError(response, "Failed to delete user");
  }
};

export const uploadUserAvatar = async ({
  file,
}: {
  file: File;
}): Promise<{ publicUrl: string }> => {
  try {
    // Files go straight to Storage (its RLS limits users to their own
    // folder); only the profile write goes through the API.
    const { supabase, userId } = await getSessionClient();

    const url = await uploadAvatarFile(supabase, userId, file);

    // The path is the same on every upload, so version it: an unchanged
    // `avatar_url` would keep showing the browser-cached image.
    const publicUrl = `${url}?v=${Date.now()}`;

    await updateUserProfile({ data: { avatar_url: publicUrl } });

    return { publicUrl };
  } catch (error) {
    console.error("Error uploading avatar", error);
    throw error;
  }
};
