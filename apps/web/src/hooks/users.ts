import {
  deleteUser,
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "@/lib/db/users";
import type { Tables, TablesUpdate } from "@/lib/supabase/database.types";
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

export enum UsersServerKeys {
  GET_USER_PROFILE = "GET_USER_PROFILE",
  // Mutations keys are not really needed, but they can be useful for debugging / tracking
  UPLOAD_USER_AVATAR = "UPLOAD_USER_AVATAR",
  DELETE_USER = "DELETE_USER",
  UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE",
}

export const useGetUserProfile = (
  options?: Omit<UseQueryOptions<Tables<"users">>, "queryKey" | "queryFn">,
) => {
  const resQuery = useQuery({
    queryKey: [UsersServerKeys.GET_USER_PROFILE],
    queryFn: getUserProfile,
    ...options,
    meta: {
      errorMessage: "Failed to get user profile",
    },
  });

  return resQuery;
};

export const useMutateUserProfile = (
  options?: UseMutationOptions<
    void,
    Error,
    { data: TablesUpdate<"users"> },
    unknown
  >,
) => {
  const resQuery = useMutation({
    mutationFn: updateUserProfile,
    mutationKey: [UsersServerKeys.UPDATE_USER_PROFILE],
    ...options,
  });

  return resQuery;
};

export const useMutateDeleteUser = (
  options?: UseMutationOptions<void, Error, void, unknown>,
) => {
  const resQuery = useMutation({
    mutationFn: deleteUser,
    mutationKey: [UsersServerKeys.DELETE_USER],
    ...options,
  });

  return resQuery;
};

export const useUploadUserAvatar = (
  options?: UseMutationOptions<
    { publicUrl: string },
    Error,
    { file: File },
    unknown
  >,
) => {
  const resQuery = useMutation({
    mutationFn: uploadUserAvatar,
    mutationKey: [UsersServerKeys.UPLOAD_USER_AVATAR],
    ...options,
  });

  return resQuery;
};
