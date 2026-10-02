export type Company = {
  slug: string;
  name: string;
  description: string;
  websiteUrl: string;
  careersUrl: string;
  githubUrl: string;
  instagramUrl?: string;
  facebookUrl?: string;
  categories: string[] | string;
  locations: string[];
  isFeatured?: boolean;
  logoUrl?: string;
};

/** Who owns a company row's content; the README sync only manages `readme`. */
export type CompanySource = "readme" | "manual" | "app";
