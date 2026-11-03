import type { DbClient, TablesInsert } from "../types";

const API_KEY_COLUMNS =
  "id, user_id, key_prefix, permission, rate_limit_per_minute, expires_at";

export type ActiveApiKey = {
  id: string;
  user_id: string;
  key_prefix: string;
  permission: "read" | "read_write";
  rate_limit_per_minute: number;
  expires_at: string | null;
};

export type ApiKeySummary = {
  id: string;
  name: string;
  key_prefix: string;
  permission: "read" | "read_write";
  rate_limit_per_minute: number;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
};

/** Resolves a server-issued key digest. Revoked and expired keys never match. */
export const getActiveApiKeyByHash = async (
  supabase: DbClient,
  keyHash: string,
): Promise<ActiveApiKey | null> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("api_keys")
    .select(API_KEY_COLUMNS)
    .eq("key_hash", keyHash)
    .is("revoked_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .maybeSingle();

  if (error) throw error;

  return data;
};

/** Inserts a digest; the plaintext API key must never be persisted. */
export const insertApiKey = async (
  supabase: DbClient,
  apiKey: TablesInsert<"api_keys">,
): Promise<{ id: string; key_prefix: string }> => {
  const { data, error } = await supabase
    .from("api_keys")
    .insert(apiKey)
    .select("id, key_prefix")
    .single();

  if (error) throw error;

  return data;
};

/** Unrevoked, unexpired keys the user holds. */
export const countActiveApiKeysForUser = async (
  supabase: DbClient,
  userId: string,
): Promise<number> => {
  const now = new Date().toISOString();
  const { count, error } = await supabase
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("revoked_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`);

  if (error) throw error;

  return count ?? 0;
};

/** Records that the key authenticated a request just now. */
export const markApiKeyUsed = async (
  supabase: DbClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
};

/** Safe metadata for the API-key management UI; hashes never leave the server. */
export const getApiKeysForUser = async (
  supabase: DbClient,
  userId: string,
): Promise<ApiKeySummary[]> => {
  const { data, error } = await supabase
    .from("api_keys")
    .select(
      "id, name, key_prefix, permission, rate_limit_per_minute, created_at, last_used_at, expires_at, revoked_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

/**
 * Revokes all of the user's active keys and returns their digests, so cached
 * auth can be dropped before the account (and its keys) are deleted.
 */
export const revokeApiKeysForUser = async (
  supabase: DbClient,
  userId: string,
): Promise<string[]> => {
  const { data, error } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("revoked_at", null)
    .select("key_hash");

  if (error) throw error;

  return data.map(({ key_hash }) => key_hash);
};

/**
 * Revokes one of the user's active keys without deleting it. Returns the key's
 * digest so the caller can drop cached auth, or null if nothing was revoked.
 */
export const revokeApiKey = async (
  supabase: DbClient,
  input: { id: string; userId: string },
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", input.id)
    .eq("user_id", input.userId)
    .is("revoked_at", null)
    .select("key_hash")
    .maybeSingle();

  if (error) throw error;

  return data?.key_hash ?? null;
};

/**
 * Deletes one of the user's revoked or expired keys. Active keys never match,
 * so they must be revoked first. Returns whether a row was deleted.
 */
export const deleteInactiveApiKey = async (
  supabase: DbClient,
  input: { id: string; userId: string },
): Promise<boolean> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", input.id)
    .eq("user_id", input.userId)
    .or(`revoked_at.not.is.null,expires_at.lte.${now}`)
    // PostgREST also applies `or` to the returned rows, so its columns must be
    // selected; with `id` alone the request fails with 42703.
    .select("id, revoked_at, expires_at")
    .maybeSingle();

  if (error) throw error;

  return data !== null;
};
