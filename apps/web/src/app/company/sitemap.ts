import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { companies, updatedAtISODate } = await getParsedCompaniesData();

  let companiesRoutes = companies.map((company) => ({
    url: `${APP_URL}/company/${company.slug}`,
    lastModified: updatedAtISODate,
  }));

  return [...companiesRoutes];
}
