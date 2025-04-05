import Footer from "@/components/Footer";
import type { LayoutProps } from "@/lib/types";
import { Suspense } from "react";

export default function CategoryPageLayout({ children }: LayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
