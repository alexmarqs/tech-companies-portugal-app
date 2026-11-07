import { APP_URL } from "@/lib/metadata";
import type { MetadataRoute } from "next/types";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // The longer rule wins: the spec stays crawlable (Scalar at
        // /api-reference fetches it), the key-protected API does not.
        allow: ["/", "/api/v1/openapi.json"],
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: `${APP_URL}`,
  };
}
