"use server";

import { createClient } from "@/lib/supabase/server";
import type { CompanyMemberRole } from "@/lib/types";

const requireUser = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user || !user.email) {
    throw new Error("User not authenticated");
  }

  return user;
};

/**
 * UI-only stubs for the (not yet persisted) company membership features:
 * inviting a member to co-manage a company, and accepting/declining an
 * invitation. Each validates auth and no-ops for now.
 */
export const inviteCompanyMemberAction = async (input: {
  companySlug: string;
  email: string;
  role: CompanyMemberRole;
}) => {
  const user = await requireUser();

  // TODO: create a pending invitation row + send the invite email.
  console.log("[inviteCompanyMemberAction] invite requested (no-op)", {
    userId: user.sub,
    ...input,
  });

  return { success: true };
};

export const respondToCompanyInvitationAction = async (input: {
  // The invitation token from the email link — the DB RPCs
  // (accept_company_invitation / decline_company_invitation) are token-keyed
  // and validate status, expiry, and the invitee's email themselves.
  token: string;
  accept: boolean;
}) => {
  const user = await requireUser();

  // TODO: call the accept/decline RPC with the token.
  console.log("[respondToCompanyInvitationAction] response received (no-op)", {
    userId: user.sub,
    ...input,
  });

  return { success: true };
};

export const updateCompanyMemberRoleAction = async (input: {
  companySlug: string;
  memberId: string;
  role: CompanyMemberRole;
}) => {
  const user = await requireUser();

  // TODO: update the member's role (only owners of the company may do this).
  console.log("[updateCompanyMemberRoleAction] role change requested (no-op)", {
    userId: user.sub,
    ...input,
  });

  return { success: true };
};

export const removeCompanyMemberAction = async (input: {
  companySlug: string;
  memberId: string;
}) => {
  const user = await requireUser();

  // TODO: remove the member from the company (only owners may do this).
  console.log("[removeCompanyMemberAction] removal requested (no-op)", {
    userId: user.sub,
    ...input,
  });

  return { success: true };
};
