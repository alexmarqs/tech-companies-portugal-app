import type { z } from "@hono/zod-openapi";
import type { FilterDefinition } from "../../../lib/filters";
import type { LocationsResponseSchema } from "./schemas";

type LocationsResponse = z.infer<typeof LocationsResponseSchema>;

const toLocation = (
  location: FilterDefinition,
): LocationsResponse["data"][number] => ({
  slug: location.slug,
  name: location.name,
  companyCount: location.companyCount,
});

export const toLocationsResponse = (
  locations: FilterDefinition[],
): LocationsResponse => ({
  data: locations.map(toLocation),
});
