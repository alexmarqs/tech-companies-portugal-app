import { describe, expect, it } from "vitest";
import { getCategoryList, normalizeText } from "./company-names";

describe("getCategoryList", () => {
  it("wraps a single category in a list", () => {
    expect(getCategoryList("SaaS")).toEqual(["SaaS"]);
  });

  it("returns a list as is", () => {
    expect(getCategoryList(["SaaS", "FinTech"])).toEqual(["SaaS", "FinTech"]);
  });
});

describe("normalizeText", () => {
  it("strips emoji, including variation selectors and ZWJ sequences", () => {
    expect(normalizeText("FinTech 💳")).toBe("FinTech");
    expect(normalizeText("☁️ Cloud")).toBe("Cloud");
    expect(normalizeText("👩‍💻 Developer Tools")).toBe("Developer Tools");
  });

  it("collapses and trims whitespace", () => {
    expect(normalizeText("  Health \t  Tech  ")).toBe("Health Tech");
  });

  it("keeps accents", () => {
    expect(normalizeText("São João da Madeira")).toBe("São João da Madeira");
  });
});
