import { APP_URL } from "@/lib/metadata";
import type { MetadataRoute } from "next/types";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/*", "/admin/*"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: `${APP_URL}`,
  };
}
