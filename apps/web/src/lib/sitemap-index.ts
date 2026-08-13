import { APP_URL } from "./metadata";

/** Nested urlset sitemaps. The root `/sitemap.xml` is a sitemap index of these. */
export const CHILD_SITEMAP_PATHS = [
  "/pages/sitemap.xml",
  "/company/sitemap.xml",
  "/category/sitemap.xml",
  "/location/sitemap.xml",
] as const;

export const childSitemapUrls = () =>
  CHILD_SITEMAP_PATHS.map((path) => `${APP_URL}${path}`);

export function buildSitemapIndexXml(
  sitemapUrls: readonly string[],
  lastModified?: string,
) {
  const entries = sitemapUrls
    .map((loc) => {
      const lastmod = lastModified
        ? `\n    <lastmod>${escapeXml(lastModified)}</lastmod>`
        : "";
      return `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>${lastmod}\n  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
