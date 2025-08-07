import { getUserProfile, updateUserProfile } from "@/lib/db/users";
import type { Tables, TablesUpdate } from "@/lib/supabase/database.types";
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

export enum UsersServerKeys {
  GET_USER_PROFILE = "GET_USER_PROFILE",
}

export const useGetUserProfile = (
  options?: UseQueryOptions<Tables<"users">>,
) => {
  const resQuery = useQuery({
    queryKey: [UsersServerKeys.GET_USER_PROFILE],
    queryFn: getUserProfile,
    ...options,
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
    ...options,
  });

  return resQuery;
};
