import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { availableCategories, updatedAtISODate } =
    await getParsedCompaniesData();

  let categoriesRoutes = availableCategories.map((category) => ({
    url: `${APP_URL}/category/${category}`,
    lastModified: updatedAtISODate,
  }));

  return [...categoriesRoutes];
}
