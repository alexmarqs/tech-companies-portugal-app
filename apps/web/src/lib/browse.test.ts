import { describe, expect, it } from "vitest";
import { cityBrowseItems, cityImageSlug } from "./browse";
import type { Company } from "./types";

const company = (slug: string, locations: string[]): Company => ({
  slug,
  name: slug.toUpperCase(),
  description: "",
  websiteUrl: "",
  careersUrl: "",
  githubUrl: "",
  categories: [],
  locations,
  logoUrl: `https://logo/${slug}.png`,
});

const companies = [
  company("a", ["Lisboa"]),
  company("b", ["Lisboa"]),
  company("c", ["Lisboa", "Porto"]),
  company("d", ["Porto"]),
  company("e", ["Braga"]),
  company("f", ["Remote"]),
  company("g", ["Sertã"]),
];

describe("cityBrowseItems", () => {
  it("keeps the curated order and counts each city", () => {
    const items = cityBrowseItems(companies, ["Braga", "Lisboa", "Porto"]);

    expect(items.map((i) => [i.name, i.count])).toEqual([
      ["Braga", 1],
      ["Lisboa", 3],
      ["Porto", 2],
    ]);
  });

  it("shows only the curated cities, whatever else is in the data", () => {
    const names = cityBrowseItems(companies, ["Lisboa"]).map((i) => i.name);

    expect(names).toEqual(["Lisboa"]);
  });

  it("drops a city the data no longer has, rather than showing 0 companies", () => {
    // Guards a typo or an upstream rename from rendering an empty card.
    const names = cityBrowseItems(companies, ["Lisboa", "Lisbõa"]).map(
      (i) => i.name,
    );

    expect(names).toEqual(["Lisboa"]);
  });

  it("builds an encoded href and an asset path from the slug", () => {
    const [lisboa] = cityBrowseItems(companies, ["Lisboa"]);

    expect(lisboa).toMatchObject({
      href: "/location/Lisboa",
      imageSrc: "/assets/images/cities/lisboa.webp",
    });
  });
});

describe("cityImageSlug", () => {
  it("strips accents so a name can address a committed file", () => {
    expect(cityImageSlug("Angra do Heroísmo")).toBe("angra-do-heroismo");
  });
});
