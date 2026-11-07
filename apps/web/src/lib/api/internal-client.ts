import { createInternalClient } from "@tech-companies-portugal/api/internal-client";

export const internalApi = createInternalClient();

/** Throws with the API's `error.message`, or `fallback` when there is none. */
export const throwApiError = async (
  response: Response,
  fallback: string,
): Promise<never> => {
  const body = await response.json().catch(() => null);
  throw new Error(
    typeof body?.error?.message === "string" ? body.error.message : fallback,
  );
};
