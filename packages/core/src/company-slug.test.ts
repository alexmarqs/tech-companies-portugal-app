import { describe, expect, it } from "vitest";
import { toFilterSlug } from "./company-slug";

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
