import { createHash, randomBytes } from "node:crypto";

export const API_KEY_PREFIX = "tcp_live_";
const API_KEY_SECRET_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export const hashApiKey = (plaintext: string) =>
  createHash("sha256").update(plaintext).digest("hex");

export const isApiKeyFormat = (token: string) =>
  token.startsWith(API_KEY_PREFIX) &&
  API_KEY_SECRET_PATTERN.test(token.slice(API_KEY_PREFIX.length));

// The plaintext is shown to the user once; only the hash and a display prefix
// are stored.
export const generateApiKey = () => {
  const plaintext = `${API_KEY_PREFIX}${randomBytes(32).toString("base64url")}`;

  return {
    plaintext,
    keyPrefix: plaintext.slice(0, 20),
    keyHash: hashApiKey(plaintext),
  };
};
