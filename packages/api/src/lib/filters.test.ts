import { describe, expect, it } from "vitest";
import { buildFilterDefinitions, toFilterName, toFilterSlug } from "./filters";

describe("toFilterSlug", () => {
  it("lowercases and hyphenates words", () => {
    expect(toFilterSlug("Developer Tools")).toBe("developer-tools");
  });

  it("transliterates accents", () => {
    expect(toFilterSlug("São João da Madeira")).toBe("sao-joao-da-madeira");
    expect(toFilterSlug("Évora")).toBe("evora");
  });

  it("drops emoji and punctuation", () => {
    expect(toFilterSlug("FinTech 💳")).toBe("fintech");
    expect(toFilterSlug("🏢 Cyber-Security!")).toBe("cyber-security");
  });

  it("returns an empty slug for emoji-only names", () => {
    expect(toFilterSlug("🏢")).toBe("");
  });
});

describe("toFilterName", () => {
  it("strips emoji, including variation selectors and ZWJ sequences", () => {
    expect(toFilterName("FinTech 💳")).toBe("FinTech");
    expect(toFilterName("☁️ Cloud")).toBe("Cloud");
    expect(toFilterName("👩‍💻 Developer Tools")).toBe("Developer Tools");
  });

  it("collapses and trims whitespace", () => {
    expect(toFilterName("  Health \t  Tech  ")).toBe("Health Tech");
  });

  it("keeps accents", () => {
    expect(toFilterName("São João da Madeira")).toBe("São João da Madeira");
  });
});

describe("buildFilterDefinitions", () => {
  it("counts companies per slug, sorted by slug", () => {
    expect(
      buildFilterDefinitions([
        ["SaaS", "FinTech 💳"],
        ["FinTech 💳"],
        ["AdTech"],
      ]),
    ).toEqual([
      { slug: "adtech", name: "AdTech", companyCount: 1 },
      { slug: "fintech", name: "FinTech", companyCount: 2 },
      { slug: "saas", name: "SaaS", companyCount: 1 },
    ]);
  });

  it("counts a company once when it repeats a value", () => {
    expect(buildFilterDefinitions([["Lisboa", "Lisboa"]])).toEqual([
      { slug: "lisboa", name: "Lisboa", companyCount: 1 },
    ]);
  });

  it("skips values with an empty slug", () => {
    expect(buildFilterDefinitions([["🏢", "Porto"]])).toEqual([
      { slug: "porto", name: "Porto", companyCount: 1 },
    ]);
  });

  it("returns an empty list for no companies", () => {
    expect(buildFilterDefinitions([])).toEqual([]);
  });

  it("throws when different names resolve to the same slug", () => {
    expect(() => buildFilterDefinitions([["Lisboa"], ["lisboa"]])).toThrow(
      'Filter slug collision: "Lisboa" and "lisboa" both resolve to "lisboa".',
    );
  });
});
