import { APP_URL } from "@/lib/metadata";
import type { MetadataRoute } from "next/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [""].map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
