import { APP_URL } from "@/lib/metadata";
import { MetadataRoute } from "next/types";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/*", "/admin/*"],
      },
    ],
    sitemap: [
      `${APP_URL}/sitemap.xml`,
      `${APP_URL}/company/sitemap.xml`,
      `${APP_URL}/category/sitemap.xml`,
      `${APP_URL}/location/sitemap.xml`,
    ],
    host: `${APP_URL}`,
  };
}
