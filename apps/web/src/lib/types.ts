import type { SettingsTab } from "./search-params";

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

/** A heading split around the word that gets the accent colour. */
export type HeadingParts = {
  lead: string;
  name: string;
  trail: string;
};

export type SettingsTabs = {
  id: SettingsTab;
  title: string;
  disabled?: boolean;
  badge?: React.ReactNode;
};
