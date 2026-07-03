import { getInvitationByToken } from "@/lib/db/invitations";
import type { CompanyInvitation } from "@/lib/types";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

export enum InvitationsServerKeys {
  GET_INVITATION_BY_TOKEN = "GET_INVITATION_BY_TOKEN",
}

export const useGetInvitationByToken = (
  token: string,
  options?: Omit<
    UseQueryOptions<CompanyInvitation | null>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: [InvitationsServerKeys.GET_INVITATION_BY_TOKEN, token],
    queryFn: () => getInvitationByToken(token),
    ...options,
    staleTime: Number.POSITIVE_INFINITY, // this means we fetch only once and never refetch
    meta: {
      errorMessage: "Failed to get invitation",
    },
  });
