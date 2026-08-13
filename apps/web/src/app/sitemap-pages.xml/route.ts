import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import { SITEMAP_XML_HEADERS, buildUrlsetXml } from "@/lib/sitemaps";

export const dynamic = "force-static";

// A route handler rather than a `sitemap.ts` so these four URLs keep the flat
// `/sitemap-pages.xml` path instead of needing a `/pages` section.
export async function GET() {
  const { updatedAtISODate } = await getParsedCompaniesData();

  const xml = buildUrlsetXml([
    // The home page renders the company list, so its freshness tracks the
    // dataset. The legal pages omit lastmod rather than claim a false date.
    { loc: APP_URL, lastmod: updatedAtISODate },
    { loc: `${APP_URL}/about` },
    { loc: `${APP_URL}/policy` },
    { loc: `${APP_URL}/terms` },
  ]);

  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
