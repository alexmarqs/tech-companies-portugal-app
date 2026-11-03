import { handle } from "@hono/vercel";
import { app } from "@tech-companies-portugal/api";

const handler = handle(app);

// Every method Hono routes; OPTIONS answers the public API's CORS preflights.
export {
  handler as GET,
  handler as HEAD,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
};
