import { RetroContainer } from "@/components/ui/retro-container";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  NotificationsServerKeys,
  useGetUserNotificationSettings,
  useUpsertUserNotificationSetting,
} from "@/hooks/notifications";
import type { Enums, Tables } from "@/lib/supabase/database.types";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import { useThrottledCallback } from "use-debounce";

const NOTIFICATION_LABEL_MAP: Record<NotificationType, string> = {
  new_companies: "Receive email updates for new companies added",
};

type NotificationType = Enums<"notification_type">;
type NotificationChannel = Enums<"notification_channel">;

export const NotificationSettings = () => {
  const { isPending, data: notificationSettings } =
    useGetUserNotificationSettings();

  if (isPending) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <RetroContainer className="p-6">
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-md font-mono">Notification Settings</h3>
          <p className="text-xs text-muted-foreground">
            Manage how and when you receive notifications.
          </p>
        </div>
        <div className="space-y-4">
          <NotificationSettingItem
            settings={notificationSettings ?? []}
            type="new_companies"
            channel="email"
          />
        </div>
      </div>
    </RetroContainer>
  );
};

const NotificationSettingItem = memo(
  ({
    settings,
    type,
    channel,
  }: {
    settings: Tables<"notification_settings">[];
    type: NotificationType;
    channel: NotificationChannel;
  }) => {
    const setting = settings.find(
      (setting) => setting.type === type && setting.channel === channel,
    );

    // if user id will be set in the onMutate from the session, so if it does not exist this fallback is used
    const { id, user_id = "" } = setting ?? {};

    const queryClient = useQueryClient();

    const { mutate: mutateUpsertUserNotificationSetting } =
      useUpsertUserNotificationSetting({
        onMutate: async (newData) => {
          const queryKey = [
            NotificationsServerKeys.GET_USER_NOTIFICATION_SETTINGS,
          ];

          // Cancel any in-flight queries with the same query key
          await queryClient.cancelQueries({ queryKey });

          // Snapshot previous data (or empty array if none)
          const previousData =
            queryClient.getQueryData<Tables<"notification_settings">[]>(
              queryKey,
            ) ?? [];

          const existingItem = previousData.find(
            (item) =>
              item.user_id === newData.setting.user_id &&
              item.type === newData.setting.type &&
              item.channel === newData.setting.channel,
          );

          const nextData = existingItem
            ? previousData.map((item) =>
                item.id === existingItem.id
                  ? { ...item, ...newData.setting }
                  : item,
              )
            : [
                ...previousData,
                {
                  ...newData.setting,
                  id: `temp-${crypto.randomUUID()}`,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  enabled: newData.setting.enabled ?? false,
                },
              ];

          queryClient.setQueryData<Tables<"notification_settings">[]>(
            queryKey,
            nextData,
          );

          return { previousData };
        },
        // If the mutation fails,
        // use the context returned from onMutate to roll back
        onError: (_err, _newData, context) => {
          queryClient.setQueryData(
            [NotificationsServerKeys.GET_USER_NOTIFICATION_SETTINGS],
            (context as { previousData: Tables<"notification_settings">[] })
              ?.previousData,
          );
        },
        // If the mutation succeeds or fails, invalidate the query to get the latest data
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: [NotificationsServerKeys.GET_USER_NOTIFICATION_SETTINGS],
          });
        },
      });

    const handleCheckedChangeNoThrottled = useCallback(
      (checked: boolean) => {
        mutateUpsertUserNotificationSetting({
          setting: {
            id,
            type,
            channel,
            user_id,
            enabled: checked,
          },
        });
      },
      [id, type, channel, user_id, mutateUpsertUserNotificationSetting],
    );

    const handleCheckedChange = useThrottledCallback(
      handleCheckedChangeNoThrottled,
      250,
    );

    const labelId = `notification-setting-${type}-${channel}`;

    return (
      <div className="flex items-center justify-between gap-4">
        <p id={labelId} className="text-sm font-mono">
          {NOTIFICATION_LABEL_MAP[type]}
        </p>
        <Switch
          aria-labelledby={labelId}
          checked={setting?.enabled ?? false}
          onCheckedChange={handleCheckedChange}
        />
      </div>
    );
  },
);

NotificationSettingItem.displayName = "NotificationSettingItem";
