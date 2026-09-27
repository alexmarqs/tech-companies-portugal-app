import { describe, expect, it } from "vitest";
import {
  type CompanyRow,
  buildCompaniesCatalogue,
} from "./companies-catalogue";

const row = (
  slug: string,
  overrides: Partial<CompanyRow> = {},
): CompanyRow => ({
  slug,
  name: slug.toUpperCase(),
  description: "",
  website_url: `https://${slug}.pt`,
  careers_url: "",
  github_url: "",
  categories: ["SaaS"],
  locations: ["Lisboa"],
  logo_url: null,
  is_featured: false,
  updated_at: "2026-09-01T00:00:00+00:00",
  ...overrides,
});

describe("buildCompaniesCatalogue", () => {
  it("lists featured companies first, then by name", () => {
    const { companies } = buildCompaniesCatalogue([
      row("beta"),
      row("zeta", { is_featured: true, logo_url: "https://logo.png" }),
      row("Alpha"),
    ]);

    expect(companies.map((company) => company.slug)).toEqual([
      "zeta",
      "Alpha",
      "beta",
    ]);
    expect(companies[0]).toMatchObject({
      websiteUrl: "https://zeta.pt",
      isFeatured: true,
      logoUrl: "https://logo.png",
    });
    expect(companies[1]?.logoUrl).toBeUndefined();
  });

  it("sorts categories and locations alphabetically", () => {
    const { availableCategories, availableLocations } = buildCompaniesCatalogue(
      [
        row("featured", { categories: ["Travel"], locations: ["Porto"] }),
        row("first", { categories: ["FinTech", "Automotive"] }),
        row("second", {
          categories: ["FinTech"],
          locations: ["Porto", "Faro"],
        }),
      ],
    );

    expect(availableCategories).toEqual(["Automotive", "FinTech", "Travel"]);
    expect(availableLocations).toEqual(["Faro", "Lisboa", "Porto"]);
  });

  it("uses the latest row update as the catalogue's last modified date", () => {
    const { updatedAtISODate } = buildCompaniesCatalogue([
      row("a", { updated_at: "2026-09-01T00:00:00+00:00" }),
      row("b", { updated_at: "2026-09-20T10:30:00+00:00" }),
    ]);

    expect(updatedAtISODate).toBe("2026-09-20T10:30:00.000Z");
  });
});
