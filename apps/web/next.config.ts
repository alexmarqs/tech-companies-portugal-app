import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Disable the X-Powered-By header
  allowedDevOrigins: ["127.0.0.1"], // Allow requests from localhost
  transpilePackages: [
    "@tech-companies-portugal/analytics",
    "@tech-companies-portugal/api",
    "@tech-companies-portugal/core",
    "@tech-companies-portugal/db",
    "@tech-companies-portugal/email",
    "@tech-companies-portugal/workflows",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

// Enables the "use workflow" / "use step" directives from "workflow" lib
export default withWorkflow(nextConfig);
