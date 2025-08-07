import Footer from "@/components/Footer";
import type { LayoutProps } from "@/lib/types";

export default function LocationPageLayout({ children }: LayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
