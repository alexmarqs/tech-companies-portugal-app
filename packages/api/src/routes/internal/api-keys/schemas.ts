import { z } from "@hono/zod-openapi";

export const ApiKeySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  key_prefix: z.string(),
  permission: z.enum(["read", "read_write"]),
  rate_limit_per_minute: z.number().int(),
  created_at: z.string(),
  last_used_at: z.string().nullable(),
  expires_at: z.string().nullable(),
  revoked_at: z.string().nullable(),
});

// No `permission`: keys are read-only for now (see the create use case).
export const CreateApiKeyBodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  expiresInDays: z
    .union([z.literal(30), z.literal(90), z.literal(365)])
    .nullable(),
});

export const CreatedApiKeySchema = z.object({
  id: z.uuid(),
  key_prefix: z.string(),
  plaintext: z.string(),
});

export const ApiKeyParamsSchema = z.object({ id: z.uuid() });
