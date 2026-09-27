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
