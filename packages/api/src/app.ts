import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { globalErrorHandler, notFoundHandler } from "./middleware/errors";
import { internalApp } from "./routes/internal";
import { v1App } from "./routes/v1";
import { scalarConfig } from "./scalar";

const createApp = () => {
  const app = new Hono();

  // Reuse a valid incoming X-Request-Id, or generate one, and echo it
  // on the response. Handlers can read it with c.get("requestId").
  app.use("/api/*", requestId());

  // Public API: API-key auth, CORS, OpenAPI document at /api/v1/openapi.json.
  app.route("/api/v1", v1App);

  // Web-app routes: session auth, same origin, no OpenAPI document.
  app.route("/api/internal", internalApp);

  // API reference at /api-reference: serve the Scalar UI for the OpenAPI spec.
  app.get("/api-reference", Scalar(scalarConfig));

  // Not found handler
  app.notFound(notFoundHandler);

  // Error handler
  app.onError(globalErrorHandler);

  return app;
};

// Export the app
export const app = createApp();
