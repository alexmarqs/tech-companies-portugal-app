import { createClient } from "../supabase/client";
import type { CompanyInvitation } from "../types";

export const getInvitationByToken = async (
  token: string,
): Promise<CompanyInvitation | null> => {
  try {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user.id) {
      throw new Error("Cannot get user session");
    }

    // RLS scopes this to the invitee (email match) or a company owner; the
    // status/expiry filters keep already-answered or lapsed invitations from
    // rendering as actionable.
    const { data, error } = await supabase
      .from("company_invitations")
      .select(
        "id, role, created_at, company:companies(slug, name, logo_url), invited_by:users(email)",
      )
      .eq("token", token)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error) {
      throw error;
    }

    // The company embed is typed non-null (not-null FK) but RLS can still blank
    // it out at runtime; treat that as invitation-not-visible.
    if (!data?.company) {
      return null;
    }

    return {
      id: data.id,
      companySlug: data.company.slug,
      companyName: data.company.name,
      companyLogoUrl: data.company.logo_url ?? undefined,
      role: data.role,
      // Null when the inviter's account was deleted (FK is set null).
      invitedByEmail: data.invited_by?.email ?? null,
      invitedAtISODate: data.created_at,
    };
  } catch (error) {
    console.error("Error fetching invitation by token", error);
    throw error;
  }
};
