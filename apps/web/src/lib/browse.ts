import type { Company } from "./types";

const CITY_IMAGE_DIR = "/assets/images/cities";

// TODO: get this dynamically from PostHog or based on metrics from PostHog
export const TOP_CITIES = [
  "Lisboa",
  "Porto",
  "Aveiro",
  "Braga",
  "Coimbra",
] as const;

export const cityImageSlug = (location: string) =>
  location
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type CityBrowseItem = {
  name: string;
  href: string;
  imageSrc: string;
  count: number;
};

export const cityBrowseItems = (
  companies: Company[],
  cities: readonly string[] = TOP_CITIES,
): CityBrowseItem[] =>
  cities
    .map((name) => ({
      name,
      count: companies.filter((company) => company.locations.includes(name))
        .length,
      href: `/location/${encodeURIComponent(name)}`,
      imageSrc: `${CITY_IMAGE_DIR}/${cityImageSlug(name)}.webp`,
    }))
    // A city the data no longer has would otherwise render "0 companies".
    .filter(({ count }) => count > 0);
