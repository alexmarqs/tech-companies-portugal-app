import CompaniesHeader from "@/components/CompaniesHeader";
import { CompaniesListSkeleton } from "@/components/CompaniesListSkeleton";
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
      </main>
      <Footer />
    </>
  );
}

const AppLoading = () => {
  return (
    <div className="container mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6">
      <Skeleton className="h-16 w-full rounded-xl" />
      <CompaniesListSkeleton />
    </div>
  );
};
