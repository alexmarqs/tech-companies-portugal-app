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
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
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
    startupImage: "/assets/images/logo.png",
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
                <PWAInstallBanner />
              </NuqsAdapter>
            </AnalyticsProvider>
          </SessionProvider>
        </CustomQueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
