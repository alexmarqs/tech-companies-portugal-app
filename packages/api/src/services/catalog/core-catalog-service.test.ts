import type { Company } from "@tech-companies-portugal/core";
import { describe, expect, it, vi } from "vitest";
import { createCoreCatalogService } from "./core-catalog-service";

const company = (slug: string, overrides: Partial<Company> = {}): Company => ({
  slug,
  name: slug,
  description: `${slug} description`,
  websiteUrl: "",
  careersUrl: "",
  githubUrl: "",
  categories: ["SaaS"],
  locations: ["Lisboa"],
  ...overrides,
});

vi.mock("@tech-companies-portugal/core/server", () => ({
  getParsedCompaniesData: async () => ({
    companies: [
      company("charlie", { categories: ["FinTech 💳"], locations: ["Porto"] }),
      company("alpha"),
      company("bravo", { categories: ["FinTech 💳", "SaaS"] }),
    ],
    updatedAtISODate: "2026-10-01T00:00:00Z",
  }),
}));

const catalog = createCoreCatalogService();

describe("core catalog service", () => {
  it("lists companies in slug order with the catalog's update date", async () => {
    const result = await catalog.listCompanies({}, { limit: 100 });

    expect(result.companies.map((c) => c.slug)).toEqual([
      "alpha",
      "bravo",
      "charlie",
    ]);
    expect(result).toMatchObject({
      total: 3,
      hasMore: false,
      updatedAt: "2026-10-01T00:00:00Z",
    });
  });

  it("filters by category and location slugs", async () => {
    const result = await catalog.listCompanies(
      { category: "fintech", location: "lisboa" },
      { limit: 100 },
    );

    expect(result.companies.map((c) => c.slug)).toEqual(["bravo"]);
  });

  it("pages by slug with a keyset cursor", async () => {
    const first = await catalog.listCompanies({}, { limit: 2 });
    expect(first.companies.map((c) => c.slug)).toEqual(["alpha", "bravo"]);
    expect(first).toMatchObject({ total: 3, hasMore: true });

    const second = await catalog.listCompanies(
      {},
      { limit: 2, after: "bravo" },
    );
    expect(second.companies.map((c) => c.slug)).toEqual(["charlie"]);
    expect(second).toMatchObject({ total: 3, hasMore: false });
  });

  it("resumes after a cursor whose company no longer exists", async () => {
    const result = await catalog.listCompanies(
      {},
      { limit: 100, after: "azure" },
    );

    expect(result.companies.map((c) => c.slug)).toEqual(["bravo", "charlie"]);
  });

  it("finds a company by slug, or null", async () => {
    expect((await catalog.findCompanyBySlug("bravo"))?.slug).toBe("bravo");
    expect(await catalog.findCompanyBySlug("missing")).toBeNull();
  });

  it("lists categories and locations with company counts", async () => {
    expect(await catalog.listCategories()).toEqual([
      { slug: "fintech", name: "FinTech", companyCount: 2 },
      { slug: "saas", name: "SaaS", companyCount: 2 },
    ]);
    expect(await catalog.listLocations()).toEqual([
      { slug: "lisboa", name: "Lisboa", companyCount: 2 },
      { slug: "porto", name: "Porto", companyCount: 1 },
    ]);
  });
});
