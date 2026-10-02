import { expect, test } from "@playwright/test";

test.describe("Sitemaps", () => {
  test("root sitemap.xml is an index of the nested sitemaps", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toMatch(/xml/);

    const xml = await response.text();
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain("/sitemap-pages.xml");
    expect(xml).toContain("/company/sitemap.xml");
    expect(xml).toContain("/category/sitemap.xml");
    expect(xml).toContain("/location/sitemap.xml");
    expect(xml).not.toContain("<urlset");
  });

  test("lastmod reflects the source data, not the time it was served", async ({
    request,
  }) => {
    const parseLastmods = (xml: string) =>
      [...xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((match) =>
        Date.parse(match[1] as string),
      );

    const response = await request.get("/sitemap.xml");
    const lastmods = parseLastmods(await response.text());
    expect(lastmods).toHaveLength(4);

    // lastmod is the latest `companies.updated_at`, which can be minutes
    // old, so assert consistency instead of age.
    const [indexLastmod] = lastmods;
    expect(Number.isNaN(indexLastmod)).toBe(false);
    expect(new Set(lastmods).size).toBe(1);

    const servedAt = Date.parse(response.headers().date as string);
    expect(indexLastmod).toBeLessThanOrEqual(servedAt);

    // Separately generated sitemaps only agree to the millisecond when both
    // read the dataset; a `new Date()` regression drifts between them.
    const companySitemap = await request.get("/company/sitemap.xml");
    const companyLastmods = parseLastmods(await companySitemap.text());
    expect(companyLastmods.length).toBeGreaterThan(0);
    expect(new Set([indexLastmod, ...companyLastmods]).size).toBe(1);
  });

  test("company sitemap lists company profile URLs", async ({ request }) => {
    const response = await request.get("/company/sitemap.xml");
    expect(response.ok()).toBeTruthy();

    const xml = await response.text();
    expect(xml).toContain("<urlset");
    expect(xml).toMatch(/\/company\/[a-z0-9-]+/);
  });

  test("static pages sitemap lists home and legal URLs", async ({
    request,
  }) => {
    const response = await request.get("/sitemap-pages.xml");
    expect(response.ok()).toBeTruthy();

    const xml = await response.text();
    expect(xml).toContain("<urlset");
    expect(xml).toContain("/about");
    expect(xml).toContain("/policy");
    expect(xml).toContain("/terms");

    const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
    expect(blocks).toHaveLength(4);

    const blockFor = (path: string) =>
      blocks.find((block) => block.includes(`${path}</loc>`));

    // Legal pages omit lastmod; home tracks the dataset.
    expect(blockFor("/about")).not.toContain("<lastmod>");
    expect(blockFor("/policy")).not.toContain("<lastmod>");
    expect(blockFor("/terms")).not.toContain("<lastmod>");

    const homepage = blocks.find(
      (block) => !/\/(about|policy|terms)<\/loc>/.test(block),
    );
    expect(homepage).toContain("<lastmod>");
  });

  test("robots.txt points at the sitemap index", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toMatch(/Sitemap:.*\/sitemap\.xml/i);
    expect(body).not.toMatch(/Sitemap:.*\/company\/sitemap\.xml/i);
    expect(body).not.toMatch(/Allow: \/api\/sitemaps\//);
  });
});
