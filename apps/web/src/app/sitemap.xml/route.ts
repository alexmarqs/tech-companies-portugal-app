import { getParsedCompaniesData } from "@/lib/parser/companies";
import { buildSitemapIndexXml, childSitemapUrls } from "@/lib/sitemap-index";

export const dynamic = "force-static";

// Next.js `sitemap.ts` only emits a urlset. The root sitemap needs to be a
// sitemap index so submitting `/sitemap.xml` in Search Console also covers
// `/company/sitemap.xml`, `/category/sitemap.xml`, and `/location/sitemap.xml`.
export async function GET() {
  const { updatedAtISODate } = await getParsedCompaniesData();

  const xml = buildSitemapIndexXml(childSitemapUrls(), updatedAtISODate);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
