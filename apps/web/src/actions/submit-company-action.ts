"use server";

import { createClient } from "@/lib/supabase/server";

export type CompanyDetailsInput = {
  name: string;
  description: string;
  websiteUrl: string;
  careersUrl?: string;
  githubUrl?: string;
  categories: string[];
  locations: string[];
};

export type SubmitCompanyLogo = {
  // The uploaded logo; persisted to storage when the submission pipeline
  // lands (companies.logo_url).
  logoFile: File;
};

export type SubmitCompanyInput = CompanyDetailsInput &
  SubmitCompanyLogo & {
    isOwner: boolean;
    // Why the submitter claims ownership (e.g. LinkedIn profile). Only present
    // when isOwner is true.
    ownershipReason?: string;
  };

/**
 * UI-only stub. Once the supervised `companies` table + review pipeline exist,
 * this action will persist the submission for moderation. For now it only
 * validates auth and no-ops so the client wiring is real.
 */
export const submitCompanyAction = async (input: SubmitCompanyInput) => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user || !user.email) {
    throw new Error("User not authenticated");
  }

  // TODO: persist the submission to the supervised companies table (pending review).
  console.log("[submitCompanyAction] submission received (no-op)", {
    userId: user.sub,
    name: input.name,
  });

  return { success: true };
};
