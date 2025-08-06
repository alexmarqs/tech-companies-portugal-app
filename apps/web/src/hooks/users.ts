import { getUserProfile } from "@/lib/db/users";
import type { Tables } from "@/lib/supabase/database.types";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

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
