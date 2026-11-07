import { createHash, timingSafeEqual } from "node:crypto";

const toSha256 = (value: string) => createHash("sha256").update(value).digest();

/**
 * Constant-time comparison of a client-provided value against a trusted one.
 * Hashing both sides first gives equal-length buffers, so neither the content
 * nor the length of `expected` leaks via timing.
 *
 * Use this for comparing security-sensitive values like:
 * - Shared secrets (e.g. `CRON_SECRET`)
 * - Webhook signatures
 * - HMAC digests
 * - Authentication tokens
 */
export const safeCompare = (
  provided: string | null | undefined,
  expected: string,
) => {
  if (!provided) return false;

  return timingSafeEqual(toSha256(provided), toSha256(expected));
};

/**
 * Constant-time comparison without hashing, for values whose length is public
 * (e.g. a hex HMAC signature is always 64 chars). A length mismatch returns
 * early, so this leaks the length of `expected` — use `safeCompare` for raw
 * secrets.
 */
// export const safeCompareSignature = (
//   provided: string | null | undefined,
//   expected: string,
// ) => {
//   if (!provided) return false;

//   // Byte lengths, not string lengths: timingSafeEqual throws on a mismatch and
//   // multi-byte UTF-8 characters make the two differ.
//   const providedBuffer = Buffer.from(provided, "utf8");
//   const expectedBuffer = Buffer.from(expected, "utf8");

//   if (providedBuffer.length !== expectedBuffer.length) return false;

//   return timingSafeEqual(providedBuffer, expectedBuffer);
// };
