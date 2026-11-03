import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  NotificationsServerKeys,
  useGetUserNotificationSettings,
  useUpsertUserNotificationSetting,
} from "@/hooks/notifications";
import type { NotificationSetting } from "@/lib/api/notifications";
import { useQueryClient } from "@tanstack/react-query";
import type { Enums } from "@tech-companies-portugal/db/types";
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
    <Container variant="static" className="p-6">
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-md">Notification Settings</h3>
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
    </Container>
  );
};

const NotificationSettingItem = memo(
  ({
    settings,
    type,
    channel,
  }: {
    settings: NotificationSetting[];
    type: NotificationType;
    channel: NotificationChannel;
  }) => {
    const setting = settings.find(
      (setting) => setting.type === type && setting.channel === channel,
    );

    const queryClient = useQueryClient();
    const queryKey = [NotificationsServerKeys.GET_USER_NOTIFICATION_SETTINGS];

    const { mutate: mutateUpsertUserNotificationSetting } =
      useUpsertUserNotificationSetting({
        onMutate: async (newSetting) => {
          // Cancel any in-flight queries with the same query key
          await queryClient.cancelQueries({ queryKey });

          // Snapshot previous data (or empty array if none)
          const previousData =
            queryClient.getQueryData<NotificationSetting[]>(queryKey) ?? [];

          const isSameSetting = (item: NotificationSetting) =>
            item.type === newSetting.type &&
            item.channel === newSetting.channel;

          // The API keys rows on (user, type, channel); the temp row is
          // replaced by the server's on refetch.
          const nextData = previousData.some(isSameSetting)
            ? previousData.map((item) =>
                isSameSetting(item)
                  ? { ...item, enabled: newSetting.enabled }
                  : item,
              )
            : [
                ...previousData,
                {
                  ...newSetting,
                  id: `temp-${crypto.randomUUID()}`,
                  user_id: "",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ];

          queryClient.setQueryData<NotificationSetting[]>(queryKey, nextData);

          return { previousData };
        },
        // If the mutation fails, roll back to the snapshot
        onError: (_err, _newData, context) => {
          queryClient.setQueryData(queryKey, context?.previousData);
        },
        // If the mutation succeeds or fails, invalidate the query to get the latest data
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey });
        },
      });

    const handleCheckedChangeNoThrottled = useCallback(
      (checked: boolean) => {
        mutateUpsertUserNotificationSetting({
          type,
          channel,
          enabled: checked,
        });
      },
      [type, channel, mutateUpsertUserNotificationSetting],
    );

    const handleCheckedChange = useThrottledCallback(
      handleCheckedChangeNoThrottled,
      250,
    );

    const labelId = `notification-setting-${type}-${channel}`;

    return (
      <div className="flex items-center justify-between gap-4">
        <p id={labelId} className="text-sm">
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
