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
