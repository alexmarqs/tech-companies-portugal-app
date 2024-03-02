import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fontCalsans, fontInter } from "@/lib/fonts";
import { LayoutProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech companies in Portugal 🇵🇹",
  description:
    "The most comprehensive list of tech companies in Portugal, all in one place.",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-sans antialiased",
          fontInter.variable,
          fontCalsans.variable,
        )}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
