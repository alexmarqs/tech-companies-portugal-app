import Navbar from "@/components/Navbar";
import DotPattern from "@/components/ui/dot-pattern";
import { GeistMono, GeistSans } from "@/lib/fonts";
import {
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
  verificationMetadata,
} from "@/lib/metadata";
import type { LayoutProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next/types";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

import CustomQueryClientProvider from "@/components/CustomQueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/lib/contexts/SessionContext";
import { AnalyticsProvider } from "@tech-companies-portugal/analytics/client";

export const metadata: Metadata = {
  ...defaultMetadata,
  twitter: {
    ...defaultTwitterMetadata,
  },
  openGraph: {
    ...defaultOpenGraphMetadata,
  },
  verification: {
    ...verificationMetadata,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tech Companies PT",
    startupImage: [
      // Modern iPhone (13, 14, 15 standard models) - Portrait
      {
        url: "/assets/images/splash/apple-splash-1170-2532.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      // Modern iPhone - Landscape
      {
        url: "/assets/images/splash/apple-splash-2532-1170.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      // iPad - Portrait
      {
        url: "/assets/images/splash/apple-splash-1668-2388.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      // iPad - Landscape
      {
        url: "/assets/images/splash/apple-splash-2388-1668.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <CustomQueryClientProvider>
          <SessionProvider>
            <AnalyticsProvider>
              <NuqsAdapter>
                <Navbar />
                {children}
                <DotPattern
                  className={cn(
                    "[mask-image:radial-gradient(620px_circle_at_center,white,transparent)] fixed inset-0 -z-10",
                  )}
                />
              </NuqsAdapter>
            </AnalyticsProvider>
          </SessionProvider>
        </CustomQueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
