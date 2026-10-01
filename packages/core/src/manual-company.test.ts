import { describe, expect, it } from "vitest";
import {
  type ManualCompanyEntry,
  prepareManualCompany,
} from "./manual-company";

const entry = (
  overrides: Partial<ManualCompanyEntry> = {},
): ManualCompanyEntry => ({
  name: "RealtyBoost",
  websiteUrl: "https://www.realtyboost.ai",
  description:
    "AI-generated Facebook and Instagram ads for real estate agents and agencies.",
  categories: ["Enterprise Software 🏢", "PropTech 🏠"],
  locations: ["Lisboa"],
  instagramUrl: "https://www.instagram.com/realtyboostai/",
  facebookUrl: "https://www.facebook.com/profile.php?id=61554673853233",
  ...overrides,
});

const none = new Set<string>();

describe("prepareManualCompany", () => {
  it("prepares a valid entry", () => {
    const result = prepareManualCompany(entry(), none);

    expect(result).toEqual({
      ok: true,
      company: {
        slug: "realtyboost",
        name: "RealtyBoost",
        description:
          "AI-generated Facebook and Instagram ads for real estate agents and agencies.",
        websiteUrl: "https://www.realtyboost.ai",
        careersUrl: "",
        githubUrl: "",
        categories: ["Enterprise Software 🏢", "PropTech 🏠"],
        locations: ["Lisboa"],
        isFeatured: false,
        instagramUrl: "https://www.instagram.com/realtyboostai/",
        facebookUrl: "https://www.facebook.com/profile.php?id=61554673853233",
      },
    });
  });

  it("trims fields and de-duplicates categories and locations", () => {
    const result = prepareManualCompany(
      entry({
        name: "  RealtyBoost ",
        categories: ["PropTech 🏠", " PropTech 🏠", ""],
        locations: ["Lisboa", "Lisboa "],
        instagramUrl: "  https://instagram.com/realtyboostai ",
      }),
      none,
    );

    expect(result.ok && result.company).toMatchObject({
      slug: "realtyboost",
      name: "RealtyBoost",
      categories: ["PropTech 🏠"],
      locations: ["Lisboa"],
      instagramUrl: "https://instagram.com/realtyboostai",
    });
  });

  it("refuses a slug that already exists", () => {
    expect(prepareManualCompany(entry(), new Set(["realtyboost"]))).toEqual({
      ok: false,
      reason: 'slug "realtyboost" already exists',
    });
  });

  it("refuses a name that produces an empty slug", () => {
    expect(prepareManualCompany(entry({ name: "🚀" }), none)).toEqual({
      ok: false,
      reason: "missing slug",
    });
  });

  it("refuses an empty description", () => {
    expect(prepareManualCompany(entry({ description: "  " }), none)).toEqual({
      ok: false,
      reason: "missing description",
    });
  });

  it("refuses an invalid website, category or location", () => {
    expect(
      prepareManualCompany(entry({ websiteUrl: "realtyboost.ai" }), none),
    ).toEqual({ ok: false, reason: "invalid website URL" });
    expect(prepareManualCompany(entry({ categories: [] }), none)).toEqual({
      ok: false,
      reason: "missing category",
    });
    expect(prepareManualCompany(entry({ locations: [] }), none)).toEqual({
      ok: false,
      reason: "missing location",
    });
  });

  it("accepts social links on subdomains and omitted social links", () => {
    const result = prepareManualCompany(
      entry({
        instagramUrl: undefined,
        facebookUrl: "https://m.facebook.com/realtyboost",
      }),
      none,
    );

    expect(result.ok && result.company).toMatchObject({
      instagramUrl: "",
      facebookUrl: "https://m.facebook.com/realtyboost",
    });
  });

  it.each([
    ["instagramUrl", "instagram.com/realtyboostai"],
    ["instagramUrl", "https://instagram.com.evil.io/realtyboostai"],
    ["instagramUrl", "https://www.facebook.com/realtyboost"],
    ["instagramUrl", "ftp://instagram.com/realtyboostai"],
    ["facebookUrl", "https://notfacebook.com/realtyboost"],
    ["facebookUrl", "https://www.instagram.com/realtyboostai/"],
  ] as const)("refuses %s %s", (field, url) => {
    expect(prepareManualCompany(entry({ [field]: url }), none)).toEqual({
      ok: false,
      reason:
        field === "instagramUrl"
          ? "instagramUrl must be an instagram.com URL"
          : "facebookUrl must be a facebook.com URL",
    });
  });
});
