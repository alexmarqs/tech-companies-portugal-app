import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";

const USER_ID = "22222222-2222-4222-8222-222222222222";
const KEY_ID = "11111111-1111-4111-8111-111111111111";

const session = vi.hoisted(() => ({ userId: null as string | null }));
const db = vi.hoisted(() => ({
  getApiKeysForUser: vi.fn(),
  revokeApiKey: vi.fn(),
  deleteInactiveApiKey: vi.fn(),
  insertApiKey: vi.fn(),
  countActiveApiKeysForUser: vi.fn(),
  getUserProfileById: vi.fn(),
  updateUserProfileById: vi.fn(),
  getNotificationSettingsByUserId: vi.fn(),
  upsertNotificationSetting: vi.fn(),
  deleteUser: vi.fn(),
  listAvatars: vi.fn(),
  removeAvatars: vi.fn(),
  revokeApiKeysForUser: vi.fn(),
}));
const admin = vi.hoisted(() => ({}) as Record<string, unknown>);

vi.mock("@tech-companies-portugal/db/server", () => ({
  createAdminClient: async () => admin,
  createClient: async () => ({
    auth: {
      getClaims: async () => ({
        data: session.userId ? { claims: { sub: session.userId } } : null,
        error: null,
      }),
    },
  }),
}));

vi.mock("@tech-companies-portugal/db/queries", async (importOriginal) => {
  // Auth and Storage queries run for real against the fake admin client below.
  const { AVATARS_BUCKET, deleteAuthUser, removeUserAvatars } =
    await importOriginal<
      typeof import("@tech-companies-portugal/db/queries")
    >();
  return {
    AVATARS_BUCKET,
    deleteAuthUser,
    removeUserAvatars,
    getActiveApiKeyByHash: async () => null,
    getApiKeysForUser: db.getApiKeysForUser,
    revokeApiKey: db.revokeApiKey,
    deleteInactiveApiKey: db.deleteInactiveApiKey,
    insertApiKey: db.insertApiKey,
    countActiveApiKeysForUser: db.countActiveApiKeysForUser,
    revokeApiKeysForUser: db.revokeApiKeysForUser,
    getUserProfileById: db.getUserProfileById,
    updateUserProfileById: db.updateUserProfileById,
    getNotificationSettingsByUserId: db.getNotificationSettingsByUserId,
    upsertNotificationSetting: db.upsertNotificationSetting,
  };
});

vi.mock("@tech-companies-portugal/core/server", () => ({
  getParsedCompaniesData: async () => ({ companies: [], updatedAtISODate: "" }),
}));

Object.assign(admin, {
  auth: { admin: { deleteUser: db.deleteUser } },
  storage: {
    from: () => ({ list: db.listAvatars, remove: db.removeAvatars }),
  },
});

const ORIGIN = "https://techcompaniesportugal.fyi";
const SUPABASE_URL = "https://project.supabase.co";

const internalRequest = (path: string, init: RequestInit = {}) =>
  app.request(`${ORIGIN}/api/internal${path}`, init);

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json", Origin: ORIGIN },
  body: JSON.stringify(body),
});

describe("internal API", () => {
  beforeEach(() => {
    session.userId = USER_ID;
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL);
  });

  it("requires a signed-in session", async () => {
    session.userId = null;
    const response = await internalRequest("/api-keys");

    expect(response.status).toBe(401);
    expect(db.getApiKeysForUser).not.toHaveBeenCalled();
  });

  it("is hidden from the OpenAPI document and has no CORS", async () => {
    const document = await (
      await app.request(`${ORIGIN}/api/v1/openapi.json`)
    ).json();
    expect(
      Object.keys(document.paths).filter((path) => path.includes("api-keys")),
    ).toEqual([]);

    const response = await internalRequest("/api-keys", {
      headers: { Origin: "https://evil.example.com" },
    });
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("cross-origin-resource-policy")).toBe(
      "same-origin",
    );
  });

  it("lists only the session user's keys", async () => {
    db.getApiKeysForUser.mockResolvedValue([]);
    const response = await internalRequest("/api-keys");

    expect(response.status).toBe(200);
    expect(db.getApiKeysForUser).toHaveBeenCalledWith(admin, USER_ID);
  });

  it("creates a key for the session user and returns the plaintext once", async () => {
    db.countActiveApiKeysForUser.mockResolvedValue(0);
    db.insertApiKey.mockResolvedValue({
      id: KEY_ID,
      key_prefix: "tcp_live_abcd",
    });

    const response = await internalRequest(
      "/api-keys",
      jsonInit("POST", {
        name: "CI",
        permission: "read_write",
        expiresInDays: 30,
        rateLimitPerMinute: 10_000,
        userId: "33333333-3333-4333-8333-333333333333",
      }),
    );

    expect(response.status).toBe(201);
    const created = await response.json();
    expect(created).toEqual({
      id: KEY_ID,
      key_prefix: expect.any(String),
      plaintext: expect.stringMatching(/^tcp_live_/),
    });
    const [client, input] = db.insertApiKey.mock.calls[0] ?? [];
    expect(client).toBe(admin);
    expect(input).toMatchObject({
      user_id: USER_ID,
      name: "CI",
      permission: "read",
      rate_limit_per_minute: 60,
      key_prefix: created.key_prefix,
    });
    expect(Date.parse(input.expires_at)).toBeGreaterThan(Date.now());
  });

  it("refuses a key beyond the active-key cap", async () => {
    db.countActiveApiKeysForUser.mockResolvedValue(2);

    const response = await internalRequest(
      "/api-keys",
      jsonInit("POST", { name: "CI", expiresInDays: null }),
    );

    expect(response.status).toBe(409);
    expect((await response.json()).error.code).toBe("conflict");
    expect(db.countActiveApiKeysForUser).toHaveBeenCalledWith(admin, USER_ID);
    expect(db.insertApiKey).not.toHaveBeenCalled();
  });

  it("rejects invalid input and unsupported expirations", async () => {
    const response = await internalRequest(
      "/api-keys",
      jsonInit("POST", {
        name: "CI",
        permission: "read",
        expiresInDays: 7,
      }),
    );

    expect(response.status).toBe(400);
    expect(db.insertApiKey).not.toHaveBeenCalled();
  });

  it("rejects cross-site form submissions", async () => {
    const response = await internalRequest("/api-keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://evil.example.com",
      },
      body: "name=x",
    });

    expect(response.status).toBe(403);
    expect(db.insertApiKey).not.toHaveBeenCalled();
  });

  it("rejects a malformed JSON body", async () => {
    const response = await internalRequest("/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: ORIGIN },
      body: "{not json",
    });

    expect(response.status).toBe(400);
    expect(db.insertApiKey).not.toHaveBeenCalled();
  });

  it("rejects an unsupported content type", async () => {
    const response = await internalRequest("/api-keys", {
      method: "POST",
      headers: { "Content-Type": "text/plain", Origin: ORIGIN },
      body: "name=x",
    });

    expect(response.status).toBe(415);
    expect(db.insertApiKey).not.toHaveBeenCalled();
  });

  it("revokes only the session user's key", async () => {
    db.revokeApiKey
      .mockResolvedValueOnce("a".repeat(64))
      .mockResolvedValueOnce(null);

    const revoked = await internalRequest(`/api-keys/${KEY_ID}/revoke`, {
      method: "POST",
      headers: { Origin: ORIGIN },
    });
    expect(revoked.status).toBe(204);
    expect(db.revokeApiKey).toHaveBeenCalledWith(admin, {
      id: KEY_ID,
      userId: USER_ID,
    });

    const missing = await internalRequest(`/api-keys/${KEY_ID}/revoke`, {
      method: "POST",
      headers: { Origin: ORIGIN },
    });
    expect(missing.status).toBe(404);
    expect((await missing.json()).error.code).toBe("not_found");
  });

  it("deletes only the session user's inactive key", async () => {
    db.deleteInactiveApiKey
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const deleted = await internalRequest(`/api-keys/${KEY_ID}`, {
      method: "DELETE",
      headers: { Origin: ORIGIN },
    });
    expect(deleted.status).toBe(204);
    expect(db.deleteInactiveApiKey).toHaveBeenCalledWith(admin, {
      id: KEY_ID,
      userId: USER_ID,
    });

    const active = await internalRequest(`/api-keys/${KEY_ID}`, {
      method: "DELETE",
      headers: { Origin: ORIGIN },
    });
    expect(active.status).toBe(404);
    expect((await active.json()).error.code).toBe("not_found");
  });

  it("returns the session user's profile", async () => {
    db.getUserProfileById.mockResolvedValue({
      id: USER_ID,
      email: "a@example.com",
      full_name: "Ana",
      avatar_url: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });

    const response = await internalRequest("/me");

    expect(response.status).toBe(200);
    expect(db.getUserProfileById).toHaveBeenCalledWith(admin, USER_ID);
  });

  it("only updates whitelisted profile fields", async () => {
    const response = await internalRequest(
      "/me",
      jsonInit("PATCH", { full_name: " Ana ", email: "x@evil.com" }),
    );

    expect(response.status).toBe(204);
    expect(db.updateUserProfileById).toHaveBeenCalledWith(admin, USER_ID, {
      full_name: "Ana",
    });
  });

  it("rejects avatars outside the user's own folder", async () => {
    const foreign = await internalRequest(
      "/me",
      jsonInit("PATCH", {
        avatar_url: `${SUPABASE_URL}/storage/v1/object/public/avatars/33333333-3333-4333-8333-333333333333/avatar.png`,
      }),
    );
    expect(foreign.status).toBe(400);

    for (const avatar_url of [
      `${SUPABASE_URL}/storage/v1/object/public/avatars/${USER_ID}/../33333333-3333-4333-8333-333333333333/avatar.png`,
      `${SUPABASE_URL}/storage/v1/object/public/avatars/${USER_ID}/%2e%2e%2Fother.png`,
      `${SUPABASE_URL}/storage/v1/object/public/avatars/${USER_ID}/nested/avatar.png`,
      `https://evil.example.com/storage/v1/object/public/avatars/${USER_ID}/avatar.png`,
      `${SUPABASE_URL}.evil.example.com/storage/v1/object/public/avatars/${USER_ID}/avatar.png`,
      "not a url",
    ]) {
      const response = await internalRequest(
        "/me",
        jsonInit("PATCH", { avatar_url }),
      );
      expect(response.status, avatar_url).toBe(400);
    }
    expect(db.updateUserProfileById).not.toHaveBeenCalled();

    const own = await internalRequest(
      "/me",
      jsonInit("PATCH", {
        avatar_url: `${SUPABASE_URL}/storage/v1/object/public/avatars/${USER_ID}/avatar.png?v=1`,
      }),
    );
    expect(own.status).toBe(204);
  });

  it("upserts notification settings for the session user only", async () => {
    db.upsertNotificationSetting.mockResolvedValue({
      id: KEY_ID,
      user_id: USER_ID,
      type: "new_companies",
      channel: "email",
      enabled: true,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });

    const response = await internalRequest(
      "/me/notification-settings",
      jsonInit("PUT", {
        id: "44444444-4444-4444-8444-444444444444",
        user_id: "33333333-3333-4333-8333-333333333333",
        type: "new_companies",
        channel: "email",
        enabled: true,
      }),
    );

    expect(response.status).toBe(200);
    expect(db.upsertNotificationSetting).toHaveBeenCalledWith(admin, {
      user_id: USER_ID,
      type: "new_companies",
      channel: "email",
      enabled: true,
    });
  });

  it("deletes the session user's account and avatar files, revoking keys", async () => {
    db.listAvatars.mockResolvedValue({
      data: [{ name: "avatar.png" }],
      error: null,
    });
    db.removeAvatars.mockResolvedValue({ data: [], error: null });
    db.revokeApiKeysForUser.mockResolvedValue(["hash-1", "hash-2"]);
    db.deleteUser.mockResolvedValue({ error: null });

    const response = await internalRequest("/me", {
      method: "DELETE",
      headers: { Origin: ORIGIN },
    });

    expect(response.status).toBe(204);
    expect(db.removeAvatars).toHaveBeenCalledWith([`${USER_ID}/avatar.png`]);
    expect(db.deleteUser).toHaveBeenCalledWith(USER_ID);
    expect(db.revokeApiKeysForUser).toHaveBeenCalledWith(admin, USER_ID);
    // Before the delete: its cascade removes the keys' rows.
    expect(db.revokeApiKeysForUser.mock.invocationCallOrder[0]).toBeLessThan(
      db.deleteUser.mock.invocationCallOrder[0] ?? 0,
    );
  });

  it("logs unexpected failures with the request id and hides them", async () => {
    const failure = new Error("auth admin unavailable");
    db.listAvatars.mockResolvedValue({ data: [], error: null });
    db.revokeApiKeysForUser.mockResolvedValue([]);
    db.deleteUser.mockResolvedValue({ error: failure });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await internalRequest("/me", {
      method: "DELETE",
      headers: { Origin: ORIGIN, "X-Request-Id": "req-123" },
    });

    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain(
      failure.message,
    );
    expect(log).toHaveBeenCalledWith(
      "Unhandled API error",
      expect.objectContaining({
        requestId: "req-123",
        method: "DELETE",
        path: "/api/internal/me",
        error: expect.objectContaining({
          message: "[SupabaseUsersRepository] Error deleting user",
          cause: failure,
        }),
      }),
    );
  });
});
