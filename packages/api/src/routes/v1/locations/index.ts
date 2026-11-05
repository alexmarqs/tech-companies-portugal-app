import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { companiesUseCases } from "../../../composition-root";
import { zodValidationHook } from "../../../middleware/zod-validation-hook";
import { jsonContent } from "../../../openapi-schema-helpers";
import { protectedErrors } from "../responses";
import { toLocationsResponse } from "./mappers";
import { LocationsResponseSchema } from "./schemas";

const listLocationsRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listLocations",
  summary: "List locations",
  description: "Lists every supported location slug and its company count.",
  tags: ["Locations"],
  responses: {
    200: jsonContent(LocationsResponseSchema, "Available locations"),
    ...protectedErrors,
  },
});

/** Mounted at `/locations`. */
export const locationsApp = new OpenAPIHono({
  defaultHook: zodValidationHook,
}).openapi(listLocationsRoute, async (c) => {
  const locations = await companiesUseCases.listLocationsUseCase();
  return c.json(toLocationsResponse(locations), 200);
});
