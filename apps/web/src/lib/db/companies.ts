import { createClient } from "../supabase/client";
import type { Tables } from "../supabase/database.types";
import type {
  CompanyDraft,
  ConnectedCompanyDetail,
  ConnectedCompanySummary,
} from "../types";

// `draft` and `my_membership`/`members` are aliased embeds resolved through
// the FKs. `draft` comes back as object-or-null (company_drafts.company_id is
// unique, so PostgREST treats it as one-to-one). `my_membership` is the
// `!inner` embed filtered to the signed-in user below — it restricts which
// companies are returned and carries their role.
//
// The list select stays slim on purpose: only what the cards render, plus a
// draft id as the "has unpublished draft" indicator. Members and the full
// draft belong to the detail select — fetched per company by the manage page.
const CONNECTED_COMPANY_SUMMARY_SELECT = `
  id, slug, name, description, logo_url, status,
  draft:company_drafts(id),
  my_membership:company_members!inner(role)
` as const;

// Everything the manage page needs in one round trip: the live listing, the
// signed-in user's role, the full draft, and the members list. Co-member
// profiles rely on the "Members can view co-member profiles" policy on users.
const CONNECTED_COMPANY_DETAIL_SELECT = `
  *,
  draft:company_drafts(*),
  my_membership:company_members!inner(role),
  members:company_members(id, user_id, role, user:users(email, full_name, avatar_url))
` as const;

// Members should still see their own pending submissions; rejected listings
// stay out until there's a moderation feedback UI for them.
const VISIBLE_STATUSES = ["approved", "pending"] as const;

const getSessionUserId = async (
  supabase: ReturnType<typeof createClient>,
): Promise<string> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error("Cannot get user session");
  }

  return session.user.id;
};

const toCompanyDraft = (
  row: Tables<"company_drafts"> | null,
): CompanyDraft | null =>
  row && {
    id: row.id,
    name: row.name,
    description: row.description,
    websiteUrl: row.website_url,
    careersUrl: row.careers_url,
    githubUrl: row.github_url,
    categories: row.categories,
    locations: row.locations,
    updatedAt: row.updated_at,
  };

export const getUserConnectedCompanies = async (): Promise<
  ConnectedCompanySummary[]
> => {
  try {
    const supabase = createClient();
    const userId = await getSessionUserId(supabase);

    const { data, error } = await supabase
      .from("companies")
      .select(CONNECTED_COMPANY_SUMMARY_SELECT)
      .eq("my_membership.user_id", userId)
      .in("status", VISIBLE_STATUSES)
      .order("name");

    if (error) {
      throw error;
    }

    return data.map((row) => ({
      companyId: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      logoUrl: row.logo_url ?? undefined,
      status: row.status,
      role: row.my_membership[0]?.role ?? "editor",
      hasPendingDraft: row.draft !== null,
    }));
  } catch (error) {
    console.error("Error fetching user connected companies", error);
    throw error;
  }
};

export const getConnectedCompanyBySlug = async (
  slug: string,
): Promise<ConnectedCompanyDetail | null> => {
  try {
    const supabase = createClient();
    const userId = await getSessionUserId(supabase);

    const { data, error } = await supabase
      .from("companies")
      .select(CONNECTED_COMPANY_DETAIL_SELECT)
      .eq("slug", slug)
      .eq("my_membership.user_id", userId)
      .in("status", VISIBLE_STATUSES)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      companyId: data.id,
      status: data.status,
      role: data.my_membership[0]?.role ?? "editor",
      company: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        websiteUrl: data.website_url,
        careersUrl: data.careers_url,
        githubUrl: data.github_url,
        categories: data.categories,
        locations: data.locations,
        logoUrl: data.logo_url ?? undefined,
        isFeatured: data.is_featured,
      },
      members: data.members.flatMap((member) =>
        member.user
          ? [
              {
                id: member.id,
                email: member.user.email,
                fullName: member.user.full_name,
                avatarUrl: member.user.avatar_url,
                role: member.role,
                isCurrentUser: member.user_id === userId,
              },
            ]
          : [],
      ),
      draft: toCompanyDraft(data.draft),
    };
  } catch (error) {
    console.error("Error fetching connected company by slug", error);
    throw error;
  }
};
