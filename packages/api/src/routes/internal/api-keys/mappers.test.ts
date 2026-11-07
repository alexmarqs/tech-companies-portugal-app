import { describe, expect, it } from "vitest";
import { toApiKeyResponse, toCreatedApiKeyResponse } from "./mappers";

const summary = {
  id: "8f1c2c1e-0b7a-4c39-9a51-6f0d6c1b2e3a",
  name: "CI",
  key_prefix: "tcp_abc",
  permission: "read" as const,
  rate_limit_per_minute: 60,
  created_at: "2026-11-01T00:00:00Z",
  last_used_at: null,
  expires_at: null,
  revoked_at: null,
};

describe("api-keys internal mappers", () => {
  it("never exposes fields beyond the key summary, leaving out empty dates", () => {
    const row = { ...summary, key_hash: "secret-digest", user_id: "u1" };

    const body = JSON.parse(JSON.stringify(toApiKeyResponse(row)));

    expect(body).toStrictEqual({
      id: summary.id,
      name: "CI",
      key_prefix: "tcp_abc",
      permission: "read",
      rate_limit_per_minute: 60,
      created_at: "2026-11-01T00:00:00Z",
    });
  });

  it("returns the created key with its plaintext only", () => {
    const created = {
      id: summary.id,
      key_prefix: summary.key_prefix,
      plaintext: "tcp_abc_plaintext",
      key_hash: "secret-digest",
    };

    expect(toCreatedApiKeyResponse(created)).toEqual({
      id: summary.id,
      key_prefix: summary.key_prefix,
      plaintext: "tcp_abc_plaintext",
    });
  });
});
