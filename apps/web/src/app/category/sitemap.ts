import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { availableCategories, updatedAtISODate } =
    await getParsedCompaniesData();

  return availableCategories.map((category) => ({
    url: `${APP_URL}/category/${encodeURIComponent(category)}`,
    lastModified: updatedAtISODate,
  }));
}
