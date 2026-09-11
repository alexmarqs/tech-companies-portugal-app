import { describe, expect, it } from "vitest";
import {
  categoryHeadingParts,
  categoryPageDescription,
  categoryPageHeading,
  categoryPageTitle,
} from "./categories";

describe("category copy", () => {
  it("strips the source emoji from the title", () => {
    expect(categoryPageTitle("Automotive 🚘")).toBe(
      "Automotive Tech Companies in Portugal",
    );
  });

  it("does not stutter when the name already says tech", () => {
    expect(categoryPageTitle("FinTech 💰")).toBe(
      "FinTech Companies in Portugal",
    );
  });

  it("keeps punctuation inside the name", () => {
    expect(categoryPageTitle("E-commerce 🛍️")).toBe(
      "E-commerce Tech Companies in Portugal",
    );
  });

  it("drops the country from the heading, which sits under a breadcrumb", () => {
    expect(categoryPageHeading("Automotive 🚘")).toBe(
      "Automotive Tech Companies",
    );
    expect(categoryPageHeading("FinTech 💰")).toBe("FinTech Companies");
  });

  it("names the category once in the description", () => {
    const description = categoryPageDescription("FinTech 💰");

    expect(description).toContain("FinTech");
    expect(description).not.toContain("💰");
    expect(description.length).toBeLessThanOrEqual(155);
  });
});

describe("categoryHeadingParts", () => {
  it("splits the name from the words around it, so the name can be tinted", () => {
    expect(categoryHeadingParts("Automotive 🚘")).toEqual({
      lead: "",
      name: "Automotive",
      trail: "Tech Companies",
    });
  });

  it("keeps the no-stutter rule when splitting", () => {
    expect(categoryHeadingParts("FinTech 💰")).toEqual({
      lead: "",
      name: "FinTech",
      trail: "Companies",
    });
  });

  it("rejoins into exactly the plain heading", () => {
    for (const category of ["Automotive 🚘", "FinTech 💰", "E-commerce 🛍️"]) {
      const { lead, name, trail } = categoryHeadingParts(category);

      expect([lead, name, trail].filter(Boolean).join(" ")).toBe(
        categoryPageHeading(category),
      );
    }
  });
});
