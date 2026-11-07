import type {
  InferRequestType,
  InferResponseType,
} from "@tech-companies-portugal/api/internal-client";
import { internalApi, throwApiError } from "./internal-client";

const notificationSettingsApiClient = internalApi.me["notification-settings"];

export type NotificationSetting = InferResponseType<
  typeof notificationSettingsApiClient.$get,
  200
>[number];
export type UpsertNotificationSettingBody = InferRequestType<
  typeof notificationSettingsApiClient.$put
>["json"];

export const getUserNotificationSettings = async (): Promise<
  NotificationSetting[]
> => {
  const response = await notificationSettingsApiClient.$get();
  if (response.status !== 200) {
    return throwApiError(response, "Failed to get notification settings");
  }

  return response.json();
};

export const upsertUserNotificationSetting = async (
  setting: UpsertNotificationSettingBody,
): Promise<NotificationSetting> => {
  const response = await notificationSettingsApiClient.$put({ json: setting });
  if (response.status !== 200) {
    return throwApiError(response, "Failed to update notification setting");
  }

  return response.json();
};
