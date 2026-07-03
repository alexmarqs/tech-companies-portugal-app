import type { SettingsTab } from "./search-params";
import type { Enums } from "./supabase/database.types";

export type Company = {
  slug: string;
  name: string;
  description: string;
  websiteUrl: string;
  careersUrl: string;
  githubUrl: string;
  categories: string[] | string;
  locations: string[];
  isFeatured?: boolean;
  logoUrl?: string;
};

export type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export type SearchParams = {
  query?: string;
  category?: string;
  location?: string;
  page?: string;
};
export type PageViewsData = {
  time: number;
  views: Record<string, number>;
}[];

export type NextParams<T> = Promise<T>;

export type SettingsTabs = {
  id: SettingsTab;
  title: string;
  disabled?: boolean;
  badge?: React.ReactNode;
};

// UI shapes for the company ownership features, mapped from the Supabase
// rows in `lib/db/companies.ts`.
export type CompanyMemberRole = Enums<"company_member_role">;

export type CompanyStatus = Enums<"company_status">;

export type CompanyMember = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: CompanyMemberRole;
  // True for the signed-in user's own membership row — you can't manage your
  // own role/removal from the members list.
  isCurrentUser?: boolean;
};

// The my-companies list only carries what its cards render; the manage page
// fetches the full detail (below) with its own query.
export type ConnectedCompanySummary = {
  companyId: string;
  slug: string;
  name: string;
  description: string;
  logoUrl?: string;
  status: CompanyStatus;
  role: CompanyMemberRole;
  // True when the company has unpublished edits. Edits to an owned company
  // are saved as a draft rather than mutating the live listing.
  hasPendingDraft: boolean;
};

// The unpublished working copy of a company (company_drafts row, UI shape).
export type CompanyDraft = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  careersUrl: string;
  githubUrl: string;
  categories: string[];
  locations: string[];
  updatedAt: string;
};

export type ConnectedCompanyDetail = {
  // companies.id — the nested `Company` is the shared UI shape and only
  // carries the slug.
  companyId: string;
  company: Company;
  status: CompanyStatus;
  role: CompanyMemberRole;
  members: CompanyMember[];
  draft: CompanyDraft | null;
};

export type CompanyInvitation = {
  id: string;
  companySlug: string;
  companyName: string;
  companyLogoUrl?: string;
  role: CompanyMemberRole;
  // Null when the inviter's account no longer exists.
  invitedByEmail: string | null;
  invitedAtISODate: string;
};
