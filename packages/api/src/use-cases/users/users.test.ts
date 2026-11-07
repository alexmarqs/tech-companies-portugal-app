import { describe, expect, it, vi } from "vitest";
import type { AvatarStorage } from "../../services/avatars/types";
import type { UsersRepository } from "../../services/users/types";
import { ValidationError } from "../errors";
import type { UserApiKeysRevoker } from "./types";
import { createUsersUseCases } from "./users";

const USER_ID = "22222222-2222-4222-8222-222222222222";

const setup = () => {
  const calls: string[] = [];
  const users = {
    getProfile: vi.fn<UsersRepository["getProfile"]>(),
    updateProfile: vi.fn<UsersRepository["updateProfile"]>(async () => {}),
    listNotificationSettings: vi.fn<
      UsersRepository["listNotificationSettings"]
    >(async () => []),
    upsertNotificationSetting:
      vi.fn<UsersRepository["upsertNotificationSetting"]>(),
    deleteUser: vi.fn<UsersRepository["deleteUser"]>(async () => {
      calls.push("deleteUser");
    }),
  } satisfies UsersRepository;
  const avatars = {
    isOwnUrl: vi.fn<AvatarStorage["isOwnUrl"]>(() => true),
    removeAllForUser: vi.fn<AvatarStorage["removeAllForUser"]>(async () => {
      calls.push("removeAvatars");
    }),
  } satisfies AvatarStorage;
  const apiKeys = {
    revokeAllForUser: vi.fn<UserApiKeysRevoker["revokeAllForUser"]>(
      async () => {
        calls.push("revokeApiKeys");
      },
    ),
  } satisfies UserApiKeysRevoker;

  return {
    calls,
    users,
    avatars,
    apiKeys,
    useCases: createUsersUseCases({
      usersRepository: users,
      avatarStorage: avatars,
      apiKeysRevoker: apiKeys,
    }),
  };
};

describe("users use cases", () => {
  it("rejects an avatar outside the user's own folder", async () => {
    const { users, avatars, useCases } = setup();
    avatars.isOwnUrl.mockReturnValue(false);

    const update = useCases.updateProfileUseCase(USER_ID, {
      avatar_url: "https://evil.example.com/avatar.png",
    });

    await expect(update).rejects.toBeInstanceOf(ValidationError);
    await expect(update).rejects.toMatchObject({
      details: [{ code: "invalid_avatar_url", path: "avatar_url" }],
    });
    expect(avatars.isOwnUrl).toHaveBeenCalledWith(
      "https://evil.example.com/avatar.png",
      USER_ID,
    );
    expect(users.updateProfile).not.toHaveBeenCalled();
  });

  it("updates the profile without an avatar check when none is set", async () => {
    const { users, avatars, useCases } = setup();

    await useCases.updateProfileUseCase(USER_ID, { full_name: "Ana" });

    expect(avatars.isOwnUrl).not.toHaveBeenCalled();
    expect(users.updateProfile).toHaveBeenCalledWith(USER_ID, {
      full_name: "Ana",
    });
  });

  // Supabase refuses to delete a user who still owns Storage objects.
  it("removes avatars and revokes the API keys before deleting the account", async () => {
    const { calls, apiKeys, useCases } = setup();

    await useCases.deleteAccountUseCase(USER_ID);

    expect(apiKeys.revokeAllForUser).toHaveBeenCalledWith(USER_ID);
    expect(calls).toEqual(["removeAvatars", "revokeApiKeys", "deleteUser"]);
  });

  it("still deletes the account when removing avatars fails", async () => {
    const { calls, avatars, useCases } = setup();
    avatars.removeAllForUser.mockRejectedValue(new Error("storage down"));
    vi.spyOn(console, "warn").mockImplementation(() => {});

    await useCases.deleteAccountUseCase(USER_ID);

    expect(calls).toEqual(["revokeApiKeys", "deleteUser"]);
  });

  it("does not delete the account when revoking its keys fails", async () => {
    const { users, apiKeys, useCases } = setup();
    apiKeys.revokeAllForUser.mockRejectedValue(new Error("db down"));

    await expect(useCases.deleteAccountUseCase(USER_ID)).rejects.toThrow(
      "db down",
    );
    expect(users.deleteUser).not.toHaveBeenCalled();
  });
});
