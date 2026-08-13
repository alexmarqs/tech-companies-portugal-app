import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import { SITEMAP_XML_HEADERS, buildUrlsetXml } from "@/lib/sitemaps";

export const dynamic = "force-static";

// Route handler so the path stays `/sitemap-pages.xml`
// (`sitemap.ts` would be `/pages/sitemap.xml`).
export async function GET() {
  const { updatedAtISODate } = await getParsedCompaniesData();

  const xml = buildUrlsetXml([
    // Home tracks the dataset; legal pages omit lastmod.
    { loc: APP_URL, lastmod: updatedAtISODate },
    { loc: `${APP_URL}/about` },
    { loc: `${APP_URL}/policy` },
    { loc: `${APP_URL}/terms` },
  ]);

  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
