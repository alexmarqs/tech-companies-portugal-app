import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { availableLocations, updatedAtISODate } =
    await getParsedCompaniesData();

  const locationsRoutes = availableLocations.map((location) => ({
    url: `${APP_URL}/location/${location}`,
    lastModified: updatedAtISODate,
  }));

  return [...locationsRoutes];
}
