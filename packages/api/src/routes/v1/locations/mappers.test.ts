import { describe, expect, it } from "vitest";
import { toLocationsResponse } from "./mappers";

describe("locations v1 mappers", () => {
  it("exposes only the documented fields", () => {
    const location = {
      slug: "lisboa",
      name: "Lisboa",
      companyCount: 5,
      internal: true,
    };

    expect(toLocationsResponse([location])).toEqual({
      data: [{ slug: "lisboa", name: "Lisboa", companyCount: 5 }],
    });
  });
});
