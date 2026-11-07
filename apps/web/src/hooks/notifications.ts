import {
  type NotificationSetting,
  type UpsertNotificationSettingBody,
  getUserNotificationSettings,
  upsertUserNotificationSetting,
} from "@/lib/api/notifications";
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
    UseQueryOptions<NotificationSetting[]>,
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
      NotificationSetting,
      Error,
      UpsertNotificationSettingBody,
      { previousData: NotificationSetting[] }
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
