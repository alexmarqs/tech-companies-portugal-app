import { describe, expect, it } from "vitest";
import { safeCompare } from "./compare";

describe("safeCompare", () => {
  it("matches identical values without accepting missing or different input", () => {
    expect(safeCompare("secret", "secret")).toBe(true);
    expect(safeCompare("different", "secret")).toBe(false);
    expect(safeCompare(undefined, "secret")).toBe(false);
  });
});

// describe("safeCompareSignature", () => {
//   it("matches equal signatures and safely rejects length mismatches", () => {
//     expect(safeCompareSignature("a".repeat(64), "a".repeat(64))).toBe(true);
//     expect(safeCompareSignature("b".repeat(64), "a".repeat(64))).toBe(false);
//     expect(safeCompareSignature("short", "a".repeat(64))).toBe(false);
//   });
// });
