import { describe, expect, it } from "vitest";
import {
  API_KEY_PREFIX,
  generateApiKey,
  hashApiKey,
  isApiKeyFormat,
} from "./api-keys";

describe("API key utilities", () => {
  it("generates a correctly formatted key and its metadata", () => {
    const generated = generateApiKey();

    expect(generated.plaintext).toMatch(/^tcp_live_[A-Za-z0-9_-]{43}$/);
    expect(generated.keyPrefix).toBe(generated.plaintext.slice(0, 20));
    expect(generated.keyHash).toBe(hashApiKey(generated.plaintext));
    expect(generated.keyHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("only accepts the complete generated format", () => {
    const valid = generateApiKey().plaintext;

    expect(isApiKeyFormat(valid)).toBe(true);
    expect(isApiKeyFormat(API_KEY_PREFIX)).toBe(false);
    expect(isApiKeyFormat(`${valid}extra`)).toBe(false);
    expect(isApiKeyFormat(valid.replace("tcp_live_", "tcp_test_"))).toBe(false);
    expect(isApiKeyFormat(`${API_KEY_PREFIX}${"!".repeat(43)}`)).toBe(false);
  });
});
