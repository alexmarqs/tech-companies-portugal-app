import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@tech-companies-portugal/analytics"],
};

export default nextConfig;
