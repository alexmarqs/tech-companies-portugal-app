import type {
  InferRequestType,
  InferResponseType,
} from "@tech-companies-portugal/api/internal-client";
import { internalApi, throwApiError } from "./internal-client";

const apiKeysApiClient = internalApi["api-keys"];

export type ApiKey = InferResponseType<
  typeof apiKeysApiClient.$get,
  200
>[number];
export type CreateApiKeyBody = InferRequestType<
  typeof apiKeysApiClient.$post
>["json"];
export type CreatedApiKey = InferResponseType<
  typeof apiKeysApiClient.$post,
  201
>;

export const getApiKeys = async (): Promise<ApiKey[]> => {
  const response = await apiKeysApiClient.$get();
  if (response.status !== 200) {
    return throwApiError(response, "Unable to load API keys.");
  }

  return response.json();
};

export const createApiKey = async (
  json: CreateApiKeyBody,
): Promise<CreatedApiKey> => {
  const response = await apiKeysApiClient.$post({ json });
  if (response.status !== 201) {
    return throwApiError(response, "Unable to create the API key.");
  }

  return response.json();
};

export const revokeApiKey = async ({ id }: { id: string }): Promise<void> => {
  const response = await apiKeysApiClient[":id"].revoke.$post({
    param: { id },
  });
  if (response.status !== 204) {
    return throwApiError(response, "Unable to revoke the API key.");
  }
};

export const deleteApiKey = async ({ id }: { id: string }): Promise<void> => {
  const response = await apiKeysApiClient[":id"].$delete({ param: { id } });
  if (response.status !== 204) {
    return throwApiError(response, "Unable to delete the API key.");
  }
};
