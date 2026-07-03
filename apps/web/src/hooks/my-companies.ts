import {
  getConnectedCompanyBySlug,
  getUserConnectedCompanies,
} from "@/lib/db/companies";
import type {
  ConnectedCompanyDetail,
  ConnectedCompanySummary,
} from "@/lib/types";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

export enum MyCompaniesServerKeys {
  GET_CONNECTED_COMPANIES = "GET_CONNECTED_COMPANIES",
  GET_CONNECTED_COMPANY = "GET_CONNECTED_COMPANY",
}

/**
 * Slim summary of the companies the signed-in user is a member of — just what
 * the list cards render. The manage page fetches the full detail (members,
 * draft body) with `useGetConnectedCompany`.
 */
export const useGetConnectedCompanies = (
  options?: Omit<
    UseQueryOptions<ConnectedCompanySummary[]>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: [MyCompaniesServerKeys.GET_CONNECTED_COMPANIES],
    queryFn: getUserConnectedCompanies,
    ...options,
    meta: {
      errorMessage: "Failed to get your companies",
    },
  });

/**
 * Full detail for one connected company: live listing, the signed-in user's
 * role, members, and the complete draft — one round trip. Returns `null` when
 * the company doesn't exist or the user isn't a member. Fetched fresh by the
 * manage page so the edit form never initializes from a stale list cache.
 */
export const useGetConnectedCompany = (
  slug: string,
  options?: Omit<
    UseQueryOptions<ConnectedCompanyDetail | null>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: [MyCompaniesServerKeys.GET_CONNECTED_COMPANY, slug],
    queryFn: () => getConnectedCompanyBySlug(slug),
    ...options,
    meta: {
      errorMessage: "Failed to get company details",
    },
  });
