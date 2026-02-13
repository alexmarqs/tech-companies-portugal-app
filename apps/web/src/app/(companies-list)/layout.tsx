import CompaniesHeader from "@/components/CompaniesHeader";
import { CompaniesListSkeleton } from "@/components/CompaniesListSkeleton";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import type { LayoutProps } from "@/lib/types";
import { Suspense } from "react";

export default function AppLayout({ children }: LayoutProps) {
  return (
    <>
      <main className="flex-1 flex-col w-full">
        <CompaniesHeader />
        <Suspense fallback={<AppLoading />}>
          <div className="container mx-auto flex w-full max-w-6xl px-4 py-2">
            {children}
          </div>
        </Suspense>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}

const AppLoading = () => {
  return (
    <div className="container mx-auto flex w-full max-w-6xl px-4 py-6 flex-1 flex-col gap-6 lg:flex-row">
      <div className="flex h-fit shrink-0 flex-col gap-5">
        <Skeleton className="h-[400px] w-full rounded-xl lg:w-[300px]" />
        <Skeleton className="h-[200px] w-full rounded-xl lg:w-[300px]" />
      </div>
      <CompaniesListSkeleton />
    </div>
  );
};
