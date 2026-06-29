import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import type { MetadataRoute } from "next/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { updatedAtISODate } = await getParsedCompaniesData();

  // The home page reflects the company dataset, so its freshness tracks the
  // data refresh. The static legal pages omit lastModified rather than claim a
  // false "updated now" on every build.
  return [
    { url: APP_URL, lastModified: updatedAtISODate },
    { url: `${APP_URL}/about` },
    { url: `${APP_URL}/policy` },
    { url: `${APP_URL}/terms` },
  ];
}
