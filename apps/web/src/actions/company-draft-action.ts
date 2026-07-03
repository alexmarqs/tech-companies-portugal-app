"use server";

import { createClient } from "@/lib/supabase/server";
import type { CompanyDetailsInput } from "./submit-company-action";

export type SaveCompanyDraftInput = CompanyDetailsInput & {
  slug: string;
};

/**
 * UI-only stubs for editing an owned company. Edits are modelled as a draft
 * (pending review) rather than a direct mutation of the live listing. Once the
 * supervised companies table exists, `saveCompanyDraftAction` will upsert the
 * draft and `discardCompanyDraftAction` will drop it. Both no-op for now.
 */
export const saveCompanyDraftAction = async (input: SaveCompanyDraftInput) => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user || !user.email) {
    throw new Error("User not authenticated");
  }

  // TODO: upsert the draft for review (owners/editors of the company only).
  console.log("[saveCompanyDraftAction] draft saved (no-op)", {
    userId: user.sub,
    slug: input.slug,
  });

  return { success: true };
};

/**
 * Publish the current changes to the live listing. Owners only — editors can
 * save drafts but cannot publish. No-op for now.
 */
export const publishCompanyAction = async (input: SaveCompanyDraftInput) => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user || !user.email) {
    throw new Error("User not authenticated");
  }

  // TODO: publish the changes to the live listing + revalidate (owners only).
  console.log("[publishCompanyAction] published (no-op)", {
    userId: user.sub,
    slug: input.slug,
  });

  return { success: true };
};

export const discardCompanyDraftAction = async (input: { slug: string }) => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user || !user.email) {
    throw new Error("User not authenticated");
  }

  // TODO: delete the pending draft for this company.
  console.log("[discardCompanyDraftAction] draft discarded (no-op)", {
    userId: user.sub,
    slug: input.slug,
  });

  return { success: true };
};
