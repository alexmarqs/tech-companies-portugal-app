import { describe, expect, it } from "vitest";
import {
  CompanyImportGuardError,
  type ExistingCompany,
  type ImportedCompany,
  normalizeReadmeCompanies,
  planCompanyImport,
} from "./company-import";
import type { Company } from "./types";

const readmeRow = (
  slug: string,
  overrides: Partial<Company> = {},
): Company => ({
  slug,
  name: slug.toUpperCase(),
  description: `${slug} description`,
  websiteUrl: `https://${slug}.pt`,
  careersUrl: "",
  githubUrl: "",
  categories: "SaaS",
  locations: ["Lisboa"],
  isFeatured: false,
  ...overrides,
});

const imported = (
  slug: string,
  overrides: Partial<ImportedCompany> = {},
): ImportedCompany => ({
  ...readmeRow(slug),
  categories: ["SaaS"],
  ...overrides,
});

const existingRow = (
  slug: string,
  overrides: Partial<ExistingCompany> = {},
): ExistingCompany => ({
  slug,
  name: slug.toUpperCase(),
  description: `${slug} description`,
  website_url: `https://${slug}.pt`,
  careers_url: "",
  github_url: "",
  categories: ["SaaS"],
  locations: ["Lisboa"],
  logo_url: null,
  is_featured: false,
  archived_at: null,
  ...overrides,
});

describe("normalizeReadmeCompanies", () => {
  it("merges a company listed under several categories", () => {
    const { companies, duplicates } = normalizeReadmeCompanies([
      readmeRow("revenuecat", {
        categories: "Developer Tools",
        locations: ["Remote"],
      }),
      readmeRow("other"),
      readmeRow("revenuecat", {
        categories: "FinTech",
        locations: ["Remote", "Lisboa"],
        careersUrl: "https://revenuecat.pt/careers",
      }),
    ]);

    expect(duplicates).toEqual(["revenuecat"]);
    expect(companies.map((company) => company.slug)).toEqual([
      "revenuecat",
      "other",
    ]);
    expect(companies[0]).toMatchObject({
      categories: ["Developer Tools", "FinTech"],
      locations: ["Remote", "Lisboa"],
      careersUrl: "https://revenuecat.pt/careers",
    });
  });

  it("skips rows that cannot be rendered", () => {
    const { companies, invalid } = normalizeReadmeCompanies([
      readmeRow("ok"),
      readmeRow("no-site", { websiteUrl: "not a url" }),
      readmeRow("", { name: "" }),
      readmeRow("nowhere", { locations: [] }),
    ]);

    expect(companies.map((company) => company.slug)).toEqual(["ok"]);
    expect(invalid.map((company) => company.reason)).toEqual([
      "invalid website URL",
      "missing name",
      "missing location",
    ]);
  });
});

describe("planCompanyImport", () => {
  it("inserts new companies and seeds featured status only on insert", () => {
    const plan = planCompanyImport({
      existing: [existingRow("kept", { is_featured: true })],
      incoming: [
        imported("kept", { isFeatured: false }),
        imported("new", { isFeatured: true }),
      ],
    });

    expect(plan.added).toEqual(["new"]);
    expect(plan.unchanged).toBe(1);
    expect(plan.upserts).toEqual([
      expect.objectContaining({ slug: "new", is_featured: true }),
    ]);
  });

  it("records changed fields and keeps a stored logo when none was fetched", () => {
    const plan = planCompanyImport({
      existing: [existingRow("acme", { logo_url: "https://logo/acme.png" })],
      incoming: [
        imported("acme", {
          description: "new description",
          locations: ["Lisboa", "Porto"],
          logoUrl: undefined,
        }),
      ],
    });

    expect(plan.changed).toEqual([
      { slug: "acme", fields: ["description", "locations"] },
    ]);
    expect(plan.upserts[0]).toMatchObject({
      logo_url: "https://logo/acme.png",
    });
  });

  it("archives companies that left the README and restores returning ones", () => {
    const plan = planCompanyImport({
      existing: [
        existingRow("stays"),
        existingRow("gone"),
        existingRow("back", { archived_at: "2026-09-01T00:00:00Z" }),
      ],
      incoming: [imported("stays"), imported("back")],
    });

    expect(plan.archiveSlugs).toEqual(["gone"]);
    expect(plan.restored).toEqual(["back"]);
    expect(plan.upserts).toEqual([
      expect.objectContaining({ slug: "back", archived_at: null }),
    ]);
  });

  it("does not archive a company whose row failed validation", () => {
    const plan = planCompanyImport({
      existing: [existingRow("stays"), existingRow("malformed")],
      incoming: [imported("stays")],
      protectedSlugs: ["malformed"],
    });

    expect(plan.archiveSlugs).toEqual([]);
  });

  it("refuses an empty import", () => {
    expect(() =>
      planCompanyImport({ existing: [existingRow("a")], incoming: [] }),
    ).toThrow(CompanyImportGuardError);
  });
});
