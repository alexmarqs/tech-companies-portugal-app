import { handle } from "@hono/vercel";
import { app } from "@tech-companies-portugal/api";

// Workaround for Scalar not being able to fetch the spec from the API at build time.
export const dynamic = "force-static";

export const GET = handle(app);
