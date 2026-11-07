import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { v1App, v1OpenApiConfig } from "../src/routes/v1";

// Feeds the SDK's type generation (which ignores `servers`). The production
// server keeps the file usable on its own in previews, Postman and other
// tools; the live `/api/v1/openapi.json` sets it from the request instead.
const document = v1App.getOpenAPI31Document({
  ...v1OpenApiConfig,
  servers: [{ url: "https://techcompaniesportugal.fyi/api/v1" }],
});

const outFile = join(__dirname, "../openapi.json");

writeFileSync(outFile, `${JSON.stringify(document, null, 2)}\n`);

console.log(`Generated OpenAPI file to: ${outFile}`);
