import type { Company } from "@tech-companies-portugal/core";
import { describe, expect, it } from "vitest";
import { generateCompanyJsonLd } from "./json-ld";

const company = (overrides: Partial<Company> = {}): Company => ({
  slug: "realtyboost",
  name: "RealtyBoost",
  description: "AI-generated ads.",
  websiteUrl: "https://www.realtyboost.ai",
  careersUrl: "",
  githubUrl: "",
  categories: ["PropTech 🏠"],
  locations: ["Lisboa"],
  ...overrides,
});

describe("generateCompanyJsonLd", () => {
  it("lists website, GitHub and social profiles in sameAs", () => {
    const jsonLd = generateCompanyJsonLd(
      company({
        githubUrl: "https://github.com/realtyboost",
        instagramUrl: "https://www.instagram.com/realtyboostai/",
        facebookUrl: "https://www.facebook.com/profile.php?id=1",
      }),
    );

    expect(jsonLd).toMatchObject({
      sameAs: [
        "https://www.realtyboost.ai",
        "https://github.com/realtyboost",
        "https://www.instagram.com/realtyboostai/",
        "https://www.facebook.com/profile.php?id=1",
      ],
    });
  });

  it("omits empty social links", () => {
    const jsonLd = generateCompanyJsonLd(
      company({ instagramUrl: "", facebookUrl: undefined }),
    );

    expect(jsonLd).toMatchObject({ sameAs: ["https://www.realtyboost.ai"] });
  });
});
