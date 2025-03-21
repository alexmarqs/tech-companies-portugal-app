import Footer from "@/components/Footer";
import { LayoutProps } from "@/lib/types";
import { Suspense } from "react";

export default function CategoryPageLayout({ children }: LayoutProps) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Footer />
    </>
  );
}
