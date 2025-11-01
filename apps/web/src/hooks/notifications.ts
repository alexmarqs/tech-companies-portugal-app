import {
  getUserNotificationSettings,
  upsertUserNotificationSetting,
} from "@/lib/db/notifications";
import type { Tables, TablesInsert } from "@/lib/supabase/database.types";
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

export enum NotificationsServerKeys {
  GET_USER_NOTIFICATION_SETTINGS = "GET_USER_NOTIFICATION_SETTINGS",
  UPSERT_USER_NOTIFICATION_SETTING = "UPSERT_USER_NOTIFICATION_SETTING",
}

export const useGetUserNotificationSettings = (
  options?: Omit<
    UseQueryOptions<Tables<"notification_settings">[]>,
    "queryKey" | "queryFn"
  >,
) => {
  const resQuery = useQuery({
    queryKey: [NotificationsServerKeys.GET_USER_NOTIFICATION_SETTINGS],
    queryFn: getUserNotificationSettings,
    ...options,
    meta: {
      errorMessage: "Failed to get user notification settings",
    },
  });

  return resQuery;
};

export const useUpsertUserNotificationSetting = (
  options?: Omit<
    UseMutationOptions<
      void,
      Error,
      { setting: TablesInsert<"notification_settings"> }
    >,
    "mutationFn"
  >,
) => {
  const resMutation = useMutation({
    mutationKey: [NotificationsServerKeys.UPSERT_USER_NOTIFICATION_SETTING],
    mutationFn: upsertUserNotificationSetting,
    ...options,
  });

  return resMutation;
};
