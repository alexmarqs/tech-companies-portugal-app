import { z } from "@hono/zod-openapi";
import { Constants } from "@tech-companies-portugal/db/types";

export const UserProfileSchema = z.object({
  id: z.uuid(),
  email: z.string(),
  full_name: z.string().optional(),
  avatar_url: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Unknown keys (email, id, …) are stripped: only these fields are writable.
export const UpdateUserProfileBodySchema = z
  .object({
    full_name: z.string().trim().min(1).max(30),
    avatar_url: z.url().nullable(),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "Provide at least one field to update.",
  });

export const NotificationSettingSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  type: z.enum(Constants.public.Enums.notification_type),
  channel: z.enum(Constants.public.Enums.notification_channel),
  enabled: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const UpsertNotificationSettingBodySchema = z.object({
  type: z.enum(Constants.public.Enums.notification_type),
  channel: z.enum(Constants.public.Enums.notification_channel),
  enabled: z.boolean(),
});
