import Footer from "@/components/Footer";
import type { LayoutProps } from "@/lib/types";

export default function CategoryPageLayout({ children }: LayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
