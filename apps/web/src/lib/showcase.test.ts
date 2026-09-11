import { describe, expect, it } from "vitest";
import { getShowcaseSeed, pickShowcaseCompanies } from "./showcase";
import type { Company } from "./types";

const company = (slug: string, overrides: Partial<Company> = {}): Company => ({
  slug,
  name: slug.toUpperCase(),
  description: "",
  websiteUrl: "",
  careersUrl: "",
  githubUrl: "",
  categories: "SaaS",
  locations: ["Lisboa"],
  logoUrl: `https://logo/${slug}.png`,
  ...overrides,
});

const pool = ["a", "b", "c", "d", "e", "f"].map((slug) => company(slug));

describe("pickShowcaseCompanies", () => {
  it("puts the featured company first and flags it", () => {
    const companies = [...pool, company("epilot", { isFeatured: true })];

    const picked = pickShowcaseCompanies(companies, 7);

    expect(picked[0]).toMatchObject({ slug: "epilot", isFeatured: true });
    expect(picked[1]).not.toHaveProperty("isFeatured");
  });

  it("only picks companies that have a logo", () => {
    const companies = [
      company("no-logo", { logoUrl: undefined }),
      company("empty-logo", { logoUrl: "" }),
      company("bare", { locations: [], categories: [] }),
      company("ok"),
    ];

    const slugs = pickShowcaseCompanies(companies, 3).map((c) => c.slug);

    expect(slugs.sort()).toEqual(["bare", "ok"]);
  });

  it("skips a featured company without a logo", () => {
    const companies = [
      ...pool,
      company("epilot", { isFeatured: true, logoUrl: undefined }),
    ];

    const slugs = pickShowcaseCompanies(companies, 1).map((c) => c.slug);

    expect(slugs).not.toContain("epilot");
  });

  it("returns at most the requested size, three by default", () => {
    const big = Array.from({ length: 20 }, (_, i) => company(`c${i}`));

    expect(pickShowcaseCompanies(big, 1)).toHaveLength(3);
    expect(pickShowcaseCompanies(big, 1, 16)).toHaveLength(16);
    expect(pickShowcaseCompanies(big.slice(0, 5), 1, 16)).toHaveLength(5);
  });

  it("never repeats a company", () => {
    for (let seed = 0; seed < 50; seed++) {
      const slugs = pickShowcaseCompanies(pool, seed).map((c) => c.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("is deterministic for a given seed", () => {
    expect(pickShowcaseCompanies(pool, 42)).toEqual(
      pickShowcaseCompanies(pool, 42),
    );
  });

  it("rotates across seeds", () => {
    const variants = new Set(
      Array.from({ length: 30 }, (_, seed) =>
        pickShowcaseCompanies(pool, seed)
          .map((c) => c.slug)
          .join(","),
      ),
    );

    expect(variants.size).toBeGreaterThan(1);
  });

  it("carries only what the showcase renders", () => {
    const [card] = pickShowcaseCompanies([company("x")], 1);

    expect(card).toEqual({
      slug: "x",
      name: "X",
      logoUrl: "https://logo/x.png",
    });
  });
});

describe("getShowcaseSeed", () => {
  it("is the same within a UTC day and changes the next day", () => {
    const morning = new Date("2026-09-10T00:30:00Z");
    const night = new Date("2026-09-10T23:30:00Z");
    const tomorrow = new Date("2026-09-11T00:30:00Z");

    expect(getShowcaseSeed(morning)).toBe(getShowcaseSeed(night));
    expect(getShowcaseSeed(tomorrow)).toBe(getShowcaseSeed(morning) + 1);
  });
});
