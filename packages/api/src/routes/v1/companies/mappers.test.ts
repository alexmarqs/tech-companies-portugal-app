import type { Company } from "@tech-companies-portugal/core";
import { describe, expect, it } from "vitest";
import { toCompaniesResponse, toCompanyResponse } from "./mappers";

const company = (overrides: Partial<Company> = {}): Company => ({
  slug: "alpha",
  name: "Alpha",
  description: "Alpha description",
  websiteUrl: "https://alpha.pt",
  careersUrl: "",
  githubUrl: "",
  categories: ["FinTech 💳"],
  locations: ["Lisboa"],
  logoUrl: "https://cdn.example/alpha.png",
  isFeatured: true,
  ...overrides,
});

describe("companies v1 mappers", () => {
  it("exposes only the documented fields, leaving out missing links", () => {
    const body = JSON.parse(JSON.stringify(toCompanyResponse(company())));

    expect(body).toEqual({
      data: {
        slug: "alpha",
        name: "Alpha",
        description: "Alpha description",
        websiteUrl: "https://alpha.pt",
        categories: [{ slug: "fintech", name: "FinTech" }],
        locations: [{ slug: "lisboa", name: "Lisboa" }],
      },
    });
  });

  it("accepts a single category given as a string", () => {
    const { data } = toCompanyResponse(company({ categories: "FinTech 💳" }));

    expect(data.categories).toEqual([{ slug: "fintech", name: "FinTech" }]);
  });

  it("maps every company of a page, keeping a null cursor on the last one", () => {
    const body = JSON.parse(
      JSON.stringify(
        toCompaniesResponse({
          data: [company(), company({ slug: "bravo" })],
          meta: { total: 2, nextCursor: null, updatedAt: null },
        }),
      ),
    );

    expect(body.data.map((c: { slug: string }) => c.slug)).toEqual([
      "alpha",
      "bravo",
    ]);
    expect(body.meta).toStrictEqual({ total: 2, nextCursor: null });
  });
});
