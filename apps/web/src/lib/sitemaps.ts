import { APP_URL } from "./metadata";

/** Nested urlsets listed from the root `/sitemap.xml` index. */
export const CHILD_SITEMAP_PATHS = [
  "/sitemap-pages.xml",
  "/company/sitemap.xml",
  "/category/sitemap.xml",
  "/location/sitemap.xml",
] as const;

export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
} as const;

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
