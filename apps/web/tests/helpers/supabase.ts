import type { BrowserContext } from "@playwright/test";

// Defaults are the public Supabase demo keys — identical for every
// `supabase start` install, safe to commit.
const LOCAL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const LOCAL_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? LOCAL_ANON_KEY;
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? LOCAL_SERVICE_ROLE_KEY;

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

// Seeding uses the service-role key, which bypasses RLS — refuse to run
// against anything but a local stack so a misconfigured env can never point
// these helpers at a real project.
const assertLocalStack = () => {
  const isLocal =
    SUPABASE_URL.startsWith("http://127.0.0.1") ||
    SUPABASE_URL.startsWith("http://localhost");
  if (!isLocal) {
    throw new Error(
      `E2E helpers only run against a local Supabase stack (supabase start); got ${SUPABASE_URL}`,
    );
  }
};

const adminFetch = async (path: string, init?: RequestInit) => {
  assertLocalStack();
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(
      `${init?.method ?? "GET"} ${path} failed (${response.status}): ${await response.text()}`,
    );
  }
  return response;
};

/** Create a confirmed auth user (public.users row comes from the trigger). */
export const createUser = async (
  email: string,
  password: string,
): Promise<string> => {
  const response = await adminFetch("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  const user = (await response.json()) as { id: string };
  return user.id;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await adminFetch(`/auth/v1/admin/users/${userId}`, { method: "DELETE" });
};

/** Insert a row with the service role (bypasses RLS); returns the row. */
export const insertRow = async <T = Record<string, unknown>>(
  table: string,
  row: Record<string, unknown>,
): Promise<T> => {
  const response = await adminFetch(`/rest/v1/${table}`, {
    method: "POST",
    body: JSON.stringify(row),
  });
  const [inserted] = (await response.json()) as T[];
  if (inserted === undefined) {
    throw new Error(`Insert into ${table} returned no row`);
  }
  return inserted;
};

export const deleteRows = async (
  table: string,
  filter: string,
): Promise<void> => {
  await adminFetch(`/rest/v1/${table}?${filter}`, { method: "DELETE" });
};

/**
 * Sign the browser context in by minting a session with the password grant
 * and writing it as the @supabase/ssr auth cookie the app reads. Avoids any
 * OAuth/UI dependency in tests.
 */
export const signIn = async (
  context: BrowserContext,
  email: string,
  password: string,
): Promise<void> => {
  assertLocalStack();
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );
  const session = (await response.json()) as { access_token?: string };
  if (!session.access_token) {
    throw new Error(`Password sign-in failed for ${email}`);
  }

  // @supabase/ssr derives the cookie name from the project ref — the first
  // label of the Supabase URL hostname ("127" for 127.0.0.1).
  const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
  const value = `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`;

  await context.addCookies([
    { name: `sb-${ref}-auth-token`, value, url: BASE_URL },
  ]);
};
