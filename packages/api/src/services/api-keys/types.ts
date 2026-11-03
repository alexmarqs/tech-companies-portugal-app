import type { ApiKeySummary } from "@tech-companies-portugal/db/queries";

/** Safe key metadata for the management UI; hashes never leave the server. */
export type { ApiKeySummary };

export type ApiKeyPermission = "read" | "read_write";

export type ApiKeyPrincipal = {
  id: string;
  userId: string;
  keyPrefix: string;
  permission: ApiKeyPermission;
  rateLimitPerMinute: number;
  expiresAt: string | null;
};

/** A key to store: its digest only, never the plaintext. */
export type NewApiKey = {
  userId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  permission: ApiKeyPermission;
  rateLimitPerMinute: number;
  expiresAt: string | null;
};

export type ApiKeysRepository = {
  findActiveByHash: (keyHash: string) => Promise<ApiKeyPrincipal | null>;
  listForUser: (userId: string) => Promise<ApiKeySummary[]>;
  /** Unrevoked, unexpired keys the user holds. */
  countActiveForUser: (userId: string) => Promise<number>;
  /** Sets `last_used_at` to now. */
  markUsed: (id: string) => Promise<void>;
  insert: (apiKey: NewApiKey) => Promise<{ id: string }>;
  revoke: (input: { id: string; userId: string }) => Promise<string | null>;
  /** Deletes a revoked or expired key; false when none matched. */
  deleteInactive: (input: { id: string; userId: string }) => Promise<boolean>;
  /** Revokes all of the user's active keys; returns their digests. */
  revokeAllForUser: (userId: string) => Promise<string[]>;
};
