import { APP_URL } from "./metadata";

/**
 * Nested urlset sitemaps. The root `/sitemap.xml` is a sitemap index of these.
 * All four are generated from the company dataset, so they all change together
 * when it refreshes and share its timestamp as `<lastmod>`.
 */
export const CHILD_SITEMAP_PATHS = [
  "/sitemap-pages.xml",
  "/company/sitemap.xml",
  "/category/sitemap.xml",
  "/location/sitemap.xml",
] as const;

export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
} as const;

/**
 * `lastmod` is optional throughout: search engines discount the element across
 * a whole site once it proves inaccurate, so anything without a real
 * modification date omits it rather than guessing.
 */
export type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

export const childSitemapEntries = (lastmod?: string): SitemapEntry[] =>
  CHILD_SITEMAP_PATHS.map((path) => ({ loc: `${APP_URL}${path}`, lastmod }));

export function buildSitemapIndexXml(entries: readonly SitemapEntry[]) {
  return wrapXml(
    "sitemapindex",
    entries.map((entry) => renderEntry("sitemap", entry)).join("\n"),
  );
}

export function buildUrlsetXml(entries: readonly SitemapEntry[]) {
  return wrapXml(
    "urlset",
    entries.map((entry) => renderEntry("url", entry)).join("\n"),
  );
}

function renderEntry(tag: string, { loc, lastmod }: SitemapEntry) {
  const lastmodTag = lastmod
    ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>`
    : "";

  return `  <${tag}>\n    <loc>${escapeXml(loc)}</loc>${lastmodTag}\n  </${tag}>`;
}

function wrapXml(root: string, body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${root} xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</${root}>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
