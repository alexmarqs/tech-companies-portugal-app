import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { usersUseCases } from "../../../composition-root";
import type { SessionEnv } from "../../../middleware/session";
import { zodValidationHook } from "../../../middleware/zod-validation-hook";
import {
  ErrorSchema,
  jsonBody,
  jsonContent,
} from "../../../openapi-schema-helpers";
import {
  toNotificationSettingResponse,
  toUserProfileResponse,
} from "./mappers";
import {
  NotificationSettingSchema,
  UpdateUserProfileBodySchema,
  UpsertNotificationSettingBodySchema,
  UserProfileSchema,
} from "./schemas";

const unauthorizedError = jsonContent(ErrorSchema, "Not signed in");
const validationError = jsonContent(ErrorSchema, "Invalid request");

const getProfileRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: jsonContent(UserProfileSchema, "The signed-in user's profile"),
    401: unauthorizedError,
  },
});

const updateProfileRoute = createRoute({
  method: "patch",
  path: "/",
  request: jsonBody(UpdateUserProfileBodySchema),
  responses: {
    204: { description: "Updated" },
    400: validationError,
    401: unauthorizedError,
  },
});

const deleteAccountRoute = createRoute({
  method: "delete",
  path: "/",
  responses: {
    204: { description: "Account deleted" },
    401: unauthorizedError,
  },
});

const listNotificationSettingsRoute = createRoute({
  method: "get",
  path: "/notification-settings",
  responses: {
    200: jsonContent(
      z.array(NotificationSettingSchema),
      "The signed-in user's notification settings",
    ),
    401: unauthorizedError,
  },
});

const upsertNotificationSettingRoute = createRoute({
  method: "put",
  path: "/notification-settings",
  request: jsonBody(UpsertNotificationSettingBodySchema),
  responses: {
    200: jsonContent(NotificationSettingSchema, "The saved setting"),
    400: validationError,
    401: unauthorizedError,
  },
});

export const meApp = new OpenAPIHono<SessionEnv>({
  defaultHook: zodValidationHook,
})
  .openapi(getProfileRoute, async (c) => {
    const profile = await usersUseCases.getProfileUseCase(c.get("userId"));
    return c.json(toUserProfileResponse(profile), 200);
  })
  .openapi(updateProfileRoute, async (c) => {
    await usersUseCases.updateProfileUseCase(
      c.get("userId"),
      c.req.valid("json"),
    );
    return c.body(null, 204);
  })
  .openapi(deleteAccountRoute, async (c) => {
    await usersUseCases.deleteAccountUseCase(c.get("userId"));
    return c.body(null, 204);
  })
  .openapi(listNotificationSettingsRoute, async (c) => {
    const settings = await usersUseCases.listNotificationSettingsUseCase(
      c.get("userId"),
    );
    return c.json(settings.map(toNotificationSettingResponse), 200);
  })
  .openapi(upsertNotificationSettingRoute, async (c) => {
    const setting = await usersUseCases.upsertNotificationSettingUseCase(
      c.get("userId"),
      c.req.valid("json"),
    );
    return c.json(toNotificationSettingResponse(setting), 200);
  });
