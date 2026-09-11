import { describe, expect, it } from "vitest";
import {
  isRemoteLocation,
  locationHeadingParts,
  locationPageDescription,
  locationPageHeading,
  locationPageIntro,
  locationPageTitle,
} from "./locations";

describe("isRemoteLocation", () => {
  it("matches the pseudo-location whatever its casing", () => {
    expect(isRemoteLocation("Remote")).toBe(true);
    expect(isRemoteLocation("remote")).toBe(true);
    expect(isRemoteLocation("Porto")).toBe(false);
  });
});

describe("location copy", () => {
  it("keeps the country in the title", () => {
    expect(locationPageTitle("Porto")).toBe(
      "Tech Companies in Porto, Portugal",
    );
    expect(locationPageTitle("Remote")).toBe(
      "Remote Tech Companies in Portugal",
    );
  });

  it("drops the country from the heading, which sits under a breadcrumb", () => {
    expect(locationPageHeading("Porto")).toBe("Tech Companies in Porto");
    expect(locationPageHeading("Remote")).toBe("Remote Tech Companies");
  });

  it("keeps the country in the meta description", () => {
    expect(locationPageDescription("Porto")).toContain("Porto, Portugal");
  });

  it("drops the country from the on-page intro", () => {
    expect(locationPageIntro("Porto")).toContain("in Porto.");
    expect(locationPageIntro("Porto")).not.toContain("Portugal");
  });

  it("says the same thing about remote in both places", () => {
    expect(locationPageIntro("Remote")).toBe(locationPageDescription("Remote"));
  });
});

describe("locationHeadingParts", () => {
  it("tints the city, which trails the words around it", () => {
    expect(locationHeadingParts("Porto")).toEqual({
      lead: "Tech Companies in",
      name: "Porto",
      trail: "",
    });
  });

  it("tints remote, which leads the words around it", () => {
    expect(locationHeadingParts("Remote")).toEqual({
      lead: "",
      name: "Remote",
      trail: "Tech Companies",
    });
  });

  it("rejoins into exactly the plain heading", () => {
    for (const location of ["Porto", "Lisbon", "Remote"]) {
      const { lead, name, trail } = locationHeadingParts(location);

      expect([lead, name, trail].filter(Boolean).join(" ")).toBe(
        locationPageHeading(location),
      );
    }
  });
});
