import { getParsedCompaniesData } from "@/lib/parser/companies";
import {
  SITEMAP_XML_HEADERS,
  buildSitemapIndexXml,
  childSitemapUrls,
} from "@/lib/sitemaps";

export const dynamic = "force-static";

// Next.js `sitemap.ts` only emits a urlset. The root sitemap needs to be a
// sitemap index so submitting `/sitemap.xml` in Search Console also covers
// the nested company/category/location sitemaps and `/sitemap-pages.xml`.
export async function GET() {
  const { updatedAtISODate } = await getParsedCompaniesData();

  const xml = buildSitemapIndexXml(childSitemapUrls(), updatedAtISODate);

  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
