import { describe, expect, it } from "vitest";
import type {
  NotificationSetting,
  UserProfile,
} from "../../../services/users/types";
import {
  toNotificationSettingResponse,
  toUserProfileResponse,
} from "./mappers";

const profile: UserProfile = {
  id: "8f1c2c1e-0b7a-4c39-9a51-6f0d6c1b2e3a",
  email: "ana@example.com",
  full_name: "Ana",
  avatar_url: null,
  created_at: "2026-11-01T00:00:00Z",
  updated_at: "2026-11-01T00:00:00Z",
};

const setting: NotificationSetting = {
  id: "2b6a9d4e-1c3f-4e5a-8b7c-9d0e1f2a3b4c",
  user_id: profile.id,
  type: "new_companies",
  channel: "email",
  enabled: true,
  created_at: "2026-11-01T00:00:00Z",
  updated_at: "2026-11-01T00:00:00Z",
};

describe("me internal mappers", () => {
  it("exposes only the documented profile fields, leaving out empty ones", () => {
    const row = { ...profile, stripe_customer_id: "cus_123" };
    const { avatar_url: _, ...expected } = profile;

    const body = JSON.parse(JSON.stringify(toUserProfileResponse(row)));

    expect(body).toStrictEqual(expected);
  });

  it("exposes only the documented notification setting fields", () => {
    const row = { ...setting, internal_note: "x" };

    expect(toNotificationSettingResponse(row)).toEqual(setting);
  });
});
