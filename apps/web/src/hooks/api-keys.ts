import {
  type ApiKey,
  type CreateApiKeyBody,
  type CreatedApiKey,
  createApiKey,
  deleteApiKey,
  getApiKeys,
  revokeApiKey,
} from "@/lib/api/api-keys";
import {
  type UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export enum ApiKeysServerKeys {
  GET_API_KEYS = "GET_API_KEYS",
  CREATE_API_KEY = "CREATE_API_KEY",
  REVOKE_API_KEY = "REVOKE_API_KEY",
  DELETE_API_KEY = "DELETE_API_KEY",
}

export const useGetApiKeys = () => {
  const resQuery = useQuery<ApiKey[]>({
    queryKey: [ApiKeysServerKeys.GET_API_KEYS],
    queryFn: getApiKeys,
    meta: {
      errorMessage: "Failed to get API keys",
    },
  });

  return resQuery;
};

export const useCreateApiKey = (
  options?: UseMutationOptions<CreatedApiKey, Error, CreateApiKeyBody, unknown>,
) => {
  const queryClient = useQueryClient();

  const resQuery = useMutation({
    mutationFn: createApiKey,
    mutationKey: [ApiKeysServerKeys.CREATE_API_KEY],
    ...options,
    onSettled: (...args) => {
      queryClient.invalidateQueries({
        queryKey: [ApiKeysServerKeys.GET_API_KEYS],
      });
      return options?.onSettled?.(...args);
    },
  });

  return resQuery;
};

export const useRevokeApiKey = (
  options?: UseMutationOptions<void, Error, { id: string }, unknown>,
) => {
  const queryClient = useQueryClient();

  const resQuery = useMutation({
    mutationFn: revokeApiKey,
    mutationKey: [ApiKeysServerKeys.REVOKE_API_KEY],
    ...options,
    onSettled: (...args) => {
      queryClient.invalidateQueries({
        queryKey: [ApiKeysServerKeys.GET_API_KEYS],
      });
      return options?.onSettled?.(...args);
    },
  });

  return resQuery;
};

export const useDeleteApiKey = (
  options?: UseMutationOptions<void, Error, { id: string }, unknown>,
) => {
  const queryClient = useQueryClient();

  const resQuery = useMutation({
    mutationFn: deleteApiKey,
    mutationKey: [ApiKeysServerKeys.DELETE_API_KEY],
    ...options,
    onSettled: (...args) => {
      queryClient.invalidateQueries({
        queryKey: [ApiKeysServerKeys.GET_API_KEYS],
      });
      return options?.onSettled?.(...args);
    },
  });

  return resQuery;
};
