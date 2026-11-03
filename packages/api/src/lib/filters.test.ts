import { describe, expect, it } from "vitest";
import { buildFilterDefinitions } from "./filters";

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

  it("merges names that resolve to the same slug under the first one", () => {
    expect(
      buildFilterDefinitions([["Lisboa"], ["lisboa"], ["Lisboa", "LISBOA"]]),
    ).toEqual([{ slug: "lisboa", name: "Lisboa", companyCount: 3 }]);
  });
});
