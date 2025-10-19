import type { MetadataRoute } from "next";

// special Next.js route that will generate and cached (by the default)
// this will link to the /manifest.json file, header is automatically set

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tech Companies Portugal",
    short_name: "Tech Companies PT",
    description:
      "Explore a comprehensive directory of tech companies in Portugal, featuring innovative startups and established industry leaders. Access descriptions, visit their websites, explore career opportunities, and connect through their digital presence.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary", // evaluate change to "any"?
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["business", "technology"],
    icons: [
      {
        src: "/assets/images/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/images/logo.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
