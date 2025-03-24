import Navbar from "@/components/Navbar";
import DotPattern from "@/components/ui/dot-pattern";
import { GeistMono, GeistSans } from "@/lib/fonts";
import {
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
  verificationMetadata,
} from "@/lib/metadata";
import { LayoutProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Metadata, Viewport } from "next/types";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
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
};

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
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
        <NuqsAdapter>
          <Navbar />
          {children}
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(620px_circle_at_center,white,transparent)] fixed inset-0 -z-10",
            )}
          />
        </NuqsAdapter>
      </body>
    </html>
  );
}
