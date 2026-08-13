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
    expect(xml).toContain("/pages/sitemap.xml");
    expect(xml).toContain("/company/sitemap.xml");
    expect(xml).toContain("/category/sitemap.xml");
    expect(xml).toContain("/location/sitemap.xml");
    expect(xml).not.toContain("<urlset");
  });

  test("company sitemap lists company profile URLs", async ({ request }) => {
    const response = await request.get("/company/sitemap.xml");
    expect(response.ok()).toBeTruthy();

    const xml = await response.text();
    expect(xml).toContain("<urlset");
    expect(xml).toMatch(/\/company\/[a-z0-9-]+/);
  });

  test("pages sitemap lists the static site URLs", async ({ request }) => {
    const response = await request.get("/pages/sitemap.xml");
    expect(response.ok()).toBeTruthy();

    const xml = await response.text();
    expect(xml).toContain("<urlset");
    expect(xml).toContain("/about");
    expect(xml).toContain("/policy");
    expect(xml).toContain("/terms");
  });

  test("robots.txt points at the sitemap index", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toMatch(/Sitemap:.*\/sitemap\.xml/i);
    expect(body).not.toMatch(/Sitemap:.*\/company\/sitemap\.xml/i);
  });
});
