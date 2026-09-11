import { describe, expect, it } from "vitest";
import {
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
