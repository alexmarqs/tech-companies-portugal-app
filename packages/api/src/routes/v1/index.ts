import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { secureHeaders } from "hono/secure-headers";
import { apiKeysUseCases } from "../../composition-root";
import { API_TITLE, API_VERSION } from "../../config";
import { withRequireApiKey } from "../../middleware/api-key";
import { zodValidationHook } from "../../middleware/zod-validation-hook";
import { categoriesApp } from "./categories";
import { companiesApp } from "./companies";
import { locationsApp } from "./locations";

const openApiConfig = {
  openapi: "3.1.0" as const,
  info: {
    title: API_TITLE,
    version: API_VERSION,
    description: [
      "API for discovering technology companies operating in Portugal.",
      "Every data endpoint requires authentication.",
      "",
      "[← Back to Tech Companies Portugal](/integrations/api)",
    ].join("\n"),
  },
  tags: [
    { name: "Companies", description: "Company discovery" },
    { name: "Categories", description: "Supported categories" },
    { name: "Locations", description: "Supported locations" },
  ],
  security: [{ bearerAuth: [] }],
};

/**
 * Public API v1, mounted at `/api/v1`: API-key auth, CORS `*`, and its own
 * OpenAPI document. Everything registered here is public-facing.
 */
const v1App = new OpenAPIHono({ defaultHook: zodValidationHook });

v1App.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "TCP API key",
  description: "Pass your API key as `Authorization: Bearer tcp_live_…`.",
});

// Readable from any origin, like the CORS policy below.
v1App.use("*", secureHeaders({ crossOriginResourcePolicy: "cross-origin" }));

v1App.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "HEAD", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type", "If-None-Match"],
    exposeHeaders: [
      "ETag",
      "Retry-After",
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
      "X-Request-Id",
    ],
    maxAge: 86400, // 1 day
  }),
);

// !!!!! Registered before the API key middleware so the spec stays public: Hono runs
// handlers in registration order and this one ends the request !!!!!
v1App.doc31("/openapi.json", (c) => ({
  ...openApiConfig,
  servers: [{ url: `${new URL(c.req.url).origin}/api/v1` }],
}));

// Authentication and customer-specific quotas run before route handlers.
v1App.use("*", withRequireApiKey(apiKeysUseCases));

// Clients that re-check send If-None-Match and get an empty 304 back.
v1App.use("*", etag());

// One router per resource, like routes/internal.
v1App.route("/companies", companiesApp);
v1App.route("/categories", categoriesApp);
v1App.route("/locations", locationsApp);

export { v1App };
