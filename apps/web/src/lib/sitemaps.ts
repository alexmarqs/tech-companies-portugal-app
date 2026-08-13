import { APP_URL } from "./metadata";

/** Static pages urlset served by the `/api/sitemaps/pages.xml` route handler. */
export const STATIC_PAGES_SITEMAP_PATH = "/api/sitemaps/pages.xml";

/** Nested urlset sitemaps. The root `/sitemap.xml` is a sitemap index of these. */
export const CHILD_SITEMAP_PATHS = [
  STATIC_PAGES_SITEMAP_PATH,
  "/company/sitemap.xml",
  "/category/sitemap.xml",
  "/location/sitemap.xml",
] as const;

export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
} as const;

export const childSitemapUrls = () =>
  CHILD_SITEMAP_PATHS.map((path) => `${APP_URL}${path}`);

export function staticPageSitemapEntries(updatedAtISODate: string) {
  return [
    { loc: APP_URL, lastModified: updatedAtISODate },
    { loc: `${APP_URL}/about` },
    { loc: `${APP_URL}/policy` },
    { loc: `${APP_URL}/terms` },
  ];
}

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

export function buildUrlsetXml(
  urls: readonly { loc: string; lastModified?: string }[],
) {
  const entries = urls
    .map((url) => {
      const lastmod = url.lastModified
        ? `\n    <lastmod>${escapeXml(url.lastModified)}</lastmod>`
        : "";
      return `  <url>\n    <loc>${escapeXml(url.loc)}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
