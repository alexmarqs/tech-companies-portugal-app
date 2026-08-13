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
    const response = await request.get("/sitemap.xml");
    const xml = await response.text();

    const lastmods = [...xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map(
      (match) => match[1],
    );
    // GitHub may omit last-modified; lastmod is then all-or-nothing.
    expect([0, 4]).toContain(lastmods.length);

    // Older than an hour so a `new Date()` / `date` header regression fails.
    const hourInMs = 60 * 60 * 1000;

    for (const lastmod of lastmods) {
      const parsed = Date.parse(lastmod as string);
      expect(Number.isNaN(parsed)).toBe(false);
      expect(Date.now() - parsed).toBeGreaterThan(hourInMs);
    }
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
