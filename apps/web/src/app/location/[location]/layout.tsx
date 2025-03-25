import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutProps } from "@/lib/types";
import { Suspense } from "react";

export default function LocationPageLayout({ children }: LayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
