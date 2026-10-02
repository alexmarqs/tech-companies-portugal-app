import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@tech-companies-portugal/core/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { availableLocations, updatedAtISODate } =
    await getParsedCompaniesData();

  return availableLocations.map((location) => ({
    url: `${APP_URL}/location/${encodeURIComponent(location)}`,
    lastModified: updatedAtISODate,
  }));
}
