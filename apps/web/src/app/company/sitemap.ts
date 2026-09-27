import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@tech-companies-portugal/core/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { companies, updatedAtISODate } = await getParsedCompaniesData();

  return companies.map((company) => ({
    url: `${APP_URL}/company/${company.slug}`,
    lastModified: updatedAtISODate,
  }));
}
