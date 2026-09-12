import type { Company } from "./types";

const CITY_IMAGE_DIR = "/assets/images/cities";

const CITY_IMAGE_FILES: Record<string, string> = {
  aveiro: "aveiro.webp",
  braga: "braga.webp",
  coimbra: "coimbra.webp",
  lisboa: "lisboa.webp",
  porto: "porto.webp",
  remote: "remote.webp",
};

// TODO: get this dynamically from PostHog or based on metrics from PostHog
export const TOP_CITIES = [
  "Lisboa",
  "Porto",
  "Remote",
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
  imageSrc: string | null;
  count: number;
};

export const cityBrowseItems = (
  companies: Company[],
  cities: readonly string[] = TOP_CITIES,
): CityBrowseItem[] =>
  cities
    .map((name) => {
      const file = CITY_IMAGE_FILES[cityImageSlug(name)];

      return {
        name,
        count: companies.filter((company) => company.locations.includes(name))
          .length,
        href: `/location/${encodeURIComponent(name)}`,
        imageSrc: file ? `${CITY_IMAGE_DIR}/${file}` : null,
      };
    })
    // A city the data no longer has would otherwise render "0 companies".
    .filter(({ count }) => count > 0);
