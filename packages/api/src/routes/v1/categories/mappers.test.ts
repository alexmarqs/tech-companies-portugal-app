import { describe, expect, it } from "vitest";
import { toCategoriesResponse } from "./mappers";

describe("categories v1 mappers", () => {
  it("exposes only the documented fields", () => {
    const category = {
      slug: "fintech",
      name: "FinTech",
      companyCount: 3,
      internal: true,
    };

    expect(toCategoriesResponse([category])).toEqual({
      data: [{ slug: "fintech", name: "FinTech", companyCount: 3 }],
    });
  });
});
