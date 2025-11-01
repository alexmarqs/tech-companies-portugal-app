import { RetroContainer } from "@/components/ui/retro-container";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  NotificationsServerKeys,
  useGetUserNotificationSettings,
  useUpsertUserNotificationSetting,
} from "@/hooks/notifications";
import type { Tables } from "@/lib/supabase/database.types";
import { useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { useThrottledCallback } from "use-debounce";

const NOTIFICATION_LABEL_MAP = {
  new_companies: "Receive weekly email updates for new companies added",
} as const;

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
          {notificationSettings?.map((setting) => (
            <NotificationSettingItem key={setting.id} setting={setting} />
          ))}
        </div>
      </div>
    </RetroContainer>
  );
};

const NotificationSettingItem = memo(
  ({
    setting,
  }: {
    setting: Tables<"notification_settings">;
  }) => {
    const label = NOTIFICATION_LABEL_MAP[setting.type];

    const queryClient = useQueryClient();

    const { mutate: mutateUpsertUserNotificationSetting } =
      useUpsertUserNotificationSetting({
        // When mutate is called:
        onMutate: async (newData) => {
          await queryClient.cancelQueries({
            queryKey: [NotificationsServerKeys.GET_USER_NOTIFICATION_SETTINGS],
          });

          const previousData = queryClient.getQueryData<
            Tables<"notification_settings">[]
          >([NotificationsServerKeys.GET_USER_NOTIFICATION_SETTINGS]);

          queryClient.setQueryData<Tables<"notification_settings">[]>(
            [NotificationsServerKeys.GET_USER_NOTIFICATION_SETTINGS],
            previousData?.map((item) =>
              item.id === newData.setting.id
                ? { ...item, ...newData.setting }
                : item,
            ),
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

    const handleCheckedChange = useThrottledCallback((checked: boolean) => {
      mutateUpsertUserNotificationSetting({
        setting: {
          ...setting,
          enabled: checked,
        },
      });
    }, 250);

    if (!label) {
      return null;
    }

    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-mono">{label}</p>
        <Switch
          checked={setting.enabled}
          onCheckedChange={handleCheckedChange}
        />
      </div>
    );
  },
);

NotificationSettingItem.displayName = "NotificationSettingItem";
