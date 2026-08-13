import { getParsedCompaniesData } from "@/lib/parser/companies";
import {
  SITEMAP_XML_HEADERS,
  buildUrlsetXml,
  staticPageSitemapEntries,
} from "@/lib/sitemaps";

export const dynamic = "force-static";

export async function GET() {
  const { updatedAtISODate } = await getParsedCompaniesData();

  const xml = buildUrlsetXml(staticPageSitemapEntries(updatedAtISODate));

  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
