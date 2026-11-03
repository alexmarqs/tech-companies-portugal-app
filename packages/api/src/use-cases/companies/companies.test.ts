import type { Company } from "@tech-companies-portugal/core";
import { describe, expect, it, vi } from "vitest";
import type { CatalogService } from "../../services/catalog/types";
import { NotFoundError, ValidationError } from "../errors";
import { createCompaniesUseCases } from "./companies";

const company = (slug: string, overrides: Partial<Company> = {}): Company => ({
  slug,
  name: slug,
  description: `${slug} description`,
  websiteUrl: "",
  careersUrl: "",
  githubUrl: "",
  categories: ["FinTech 💳"],
  locations: ["Lisboa"],
  ...overrides,
});

const setup = () => {
  const catalog = {
    listCompanies: vi.fn<CatalogService["listCompanies"]>(async () => ({
      companies: [company("alpha")],
      total: 1,
      hasMore: false,
      updatedAt: "2026-10-01T00:00:00Z",
    })),
    findCompanyBySlug: vi.fn<CatalogService["findCompanyBySlug"]>(
      async (slug) => (slug === "alpha" ? company("alpha") : null),
    ),
    listCategories: vi.fn<CatalogService["listCategories"]>(async () => [
      { slug: "fintech", name: "FinTech", companyCount: 1 },
    ]),
    listLocations: vi.fn<CatalogService["listLocations"]>(async () => [
      { slug: "lisboa", name: "Lisboa", companyCount: 1 },
    ]),
  } satisfies CatalogService;

  return {
    catalog,
    companies: createCompaniesUseCases({ catalogService: catalog }),
  };
};

describe("companies use cases", () => {
  it("lists the catalog's companies with their total and update date", async () => {
    const { catalog, companies } = setup();

    const result = await companies.listCompaniesUseCase({
      category: "fintech",
      location: "lisboa",
      limit: 100,
    });

    expect(catalog.listCompanies).toHaveBeenCalledWith(
      { category: "fintech", location: "lisboa" },
      { limit: 100, after: undefined },
    );
    expect(result.data.map((c) => c.slug)).toEqual(["alpha"]);
    expect(result.meta).toEqual({
      total: 1,
      nextCursor: null,
      updatedAt: "2026-10-01T00:00:00Z",
    });
  });

  it("only loads the filter definitions it validates", async () => {
    const { catalog, companies } = setup();

    await companies.listCompaniesUseCase({ limit: 100 });

    expect(catalog.listCategories).not.toHaveBeenCalled();
    expect(catalog.listLocations).not.toHaveBeenCalled();
  });

  it("rejects an unknown filter without listing companies", async () => {
    const { catalog, companies } = setup();

    const error = await companies
      .listCompaniesUseCase({ location: "not-real", limit: 100 })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.details).toEqual([
      expect.objectContaining({ code: "unknown_value", path: "location" }),
    ]);
    expect(catalog.listCompanies).not.toHaveBeenCalled();
  });

  it("round-trips the last slug as an opaque cursor", async () => {
    const { catalog, companies } = setup();
    catalog.listCompanies.mockResolvedValueOnce({
      companies: [company("alpha"), company("bravo")],
      total: 3,
      hasMore: true,
      updatedAt: null,
    });

    const first = await companies.listCompaniesUseCase({ limit: 2 });
    const cursor = first.meta.nextCursor;
    expect(cursor).toEqual(expect.any(String));
    expect(cursor).not.toContain("bravo");

    await companies.listCompaniesUseCase({ limit: 2, cursor: cursor ?? "" });
    expect(catalog.listCompanies).toHaveBeenLastCalledWith(
      {},
      { limit: 2, after: "bravo" },
    );
  });

  it("rejects a malformed cursor", async () => {
    const { catalog, companies } = setup();
    const notASlug = Buffer.from("../etc", "utf8").toString("base64url");

    const error = await companies
      .listCompaniesUseCase({ limit: 100, cursor: notASlug })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.details).toEqual([
      expect.objectContaining({ code: "invalid_cursor", path: "cursor" }),
    ]);
    expect(catalog.listCompanies).not.toHaveBeenCalled();
  });

  it("maps empty links to null and names to slug/name pairs", async () => {
    const { companies } = setup();

    const alpha = await companies.getCompanyUseCase("alpha");

    expect(alpha.websiteUrl).toBeNull();
    expect(alpha.isFeatured).toBe(false);
    expect(alpha.categories).toEqual([{ slug: "fintech", name: "FinTech" }]);
  });

  it("rejects an unknown slug", async () => {
    const { companies } = setup();

    const error = await companies.getCompanyUseCase("missing").catch((e) => e);

    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.code).toBe("not_found");
  });
});
