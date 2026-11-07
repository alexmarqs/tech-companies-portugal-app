import type { z } from "@hono/zod-openapi";
import type { ApiKeySummary } from "../../../services/api-keys/types";
import type { CreatedApiKey } from "../../../use-cases/api-keys/types";
import type { ApiKeySchema, CreatedApiKeySchema } from "./schemas";

export const toApiKeyResponse = (
  apiKey: ApiKeySummary,
): z.infer<typeof ApiKeySchema> => ({
  id: apiKey.id,
  name: apiKey.name,
  key_prefix: apiKey.key_prefix,
  permission: apiKey.permission,
  rate_limit_per_minute: apiKey.rate_limit_per_minute,
  created_at: apiKey.created_at,
  last_used_at: apiKey.last_used_at ?? undefined,
  expires_at: apiKey.expires_at ?? undefined,
  revoked_at: apiKey.revoked_at ?? undefined,
});

export const toCreatedApiKeyResponse = (
  created: CreatedApiKey,
): z.infer<typeof CreatedApiKeySchema> => ({
  id: created.id,
  key_prefix: created.key_prefix,
  plaintext: created.plaintext,
});
