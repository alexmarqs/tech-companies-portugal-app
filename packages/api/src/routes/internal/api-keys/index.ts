import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { apiKeysUseCases } from "../../../composition-root";
import type { SessionEnv } from "../../../middleware/session";
import { zodValidationHook } from "../../../middleware/zod-validation-hook";
import { ErrorSchema, jsonContent } from "../../../openapi-schema-helpers";
import {
  ApiKeyParamsSchema,
  ApiKeySchema,
  CreateApiKeyBodySchema,
  CreatedApiKeySchema,
} from "./schemas";

const unauthorizedError = jsonContent(ErrorSchema, "Not signed in");

const listApiKeysRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: jsonContent(z.array(ApiKeySchema), "The user's API keys"),
    401: unauthorizedError,
  },
});

const createApiKeyRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: { "application/json": { schema: CreateApiKeyBodySchema } },
      required: true,
    },
  },
  responses: {
    // The plaintext is returned exactly once and never stored.
    201: jsonContent(CreatedApiKeySchema, "The new API key"),
    400: jsonContent(ErrorSchema, "Invalid request"),
    401: unauthorizedError,
    409: jsonContent(ErrorSchema, "Too many active API keys"),
  },
});

// Revoking keeps the row so the key stays listed; deleting removes it.
const revokeApiKeyRoute = createRoute({
  method: "post",
  path: "/{id}/revoke",
  request: { params: ApiKeyParamsSchema },
  responses: {
    204: { description: "Revoked" },
    401: unauthorizedError,
    404: jsonContent(ErrorSchema, "Not found or already revoked"),
  },
});

const deleteApiKeyRoute = createRoute({
  method: "delete",
  path: "/{id}",
  request: { params: ApiKeyParamsSchema },
  responses: {
    204: { description: "Deleted" },
    401: unauthorizedError,
    404: jsonContent(ErrorSchema, "Not found or still active"),
  },
});

export const apiKeysApp = new OpenAPIHono<SessionEnv>({
  defaultHook: zodValidationHook,
})
  .openapi(listApiKeysRoute, async (c) => {
    const apiKeys = await apiKeysUseCases.listApiKeysUseCase(c.get("userId"));
    return c.json(apiKeys, 200);
  })
  .openapi(createApiKeyRoute, async (c) => {
    const created = await apiKeysUseCases.createApiKeyUseCase(
      c.get("userId"),
      c.req.valid("json"),
    );
    return c.json(created, 201);
  })
  .openapi(revokeApiKeyRoute, async (c) => {
    await apiKeysUseCases.revokeApiKeyUseCase(
      c.get("userId"),
      c.req.valid("param").id,
    );
    return c.body(null, 204);
  })
  .openapi(deleteApiKeyRoute, async (c) => {
    await apiKeysUseCases.deleteApiKeyUseCase(
      c.get("userId"),
      c.req.valid("param").id,
    );
    return c.body(null, 204);
  });
