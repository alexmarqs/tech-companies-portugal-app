import { getParsedCompaniesData } from "@/lib/parser/companies";
import {
  SITEMAP_XML_HEADERS,
  buildSitemapIndexXml,
  childSitemapEntries,
} from "@/lib/sitemaps";

export const dynamic = "force-static";

// `sitemap.ts` only emits a urlset. This route is a sitemap index.
export async function GET() {
  const { updatedAtISODate } = await getParsedCompaniesData();

  const xml = buildSitemapIndexXml(childSitemapEntries(updatedAtISODate));

  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
