import type { Metadata } from "next/types";

export const TITLE = "Tech Companies in Portugal | Curated Directory";
export const DESCRIPTION =
  "Explore a curated directory of tech companies in Portugal. Compare startups, scaleups, and global employers by location and industry.";

export const APP_URL = process.env.VERCEL_URL
  ? "https://techcompaniesportugal.fyi"
  : "http://localhost:3000";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: TITLE,
  keywords: [
    "tech companies portugal",
    "portuguese tech companies",
    "tech jobs portugal",
    "portuguese startups",
    "tech ecosystem portugal",
    "startups portugal",
    "IT companies portugal",
    "global tech companies portugal",
    "portugal tech scene",
    "portuguese tech industry",
    "tech careers portugal",
    "software companies portugal",
    "tech directory portugal",
  ],
  description: DESCRIPTION,
  alternates: {
    canonical: APP_URL,
  },
  authors: [{ name: "Tech Companies Portugal" }],
  category: "Technology",
  creator: "Tech Companies Portugal",
  publisher: "Tech Companies Portugal",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/images/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const defaultTwitterMetadata: Metadata["twitter"] = {
  title: TITLE,
  description: DESCRIPTION,
  card: "summary_large_image",
};

export const defaultOpenGraphMetadata: Metadata["openGraph"] = {
  title: TITLE,
  description: DESCRIPTION,
  url: APP_URL,
  type: "website",
  siteName: TITLE,
};

export const verificationMetadata: Metadata["verification"] = {
  google: "cVg27MdqDoYw1j_CT6307XBo8t-9bldNpFIkc8heWio",
};
