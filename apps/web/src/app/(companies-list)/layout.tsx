import CompaniesHeader from "@/components/CompaniesHeader";
import { CompaniesListSkeleton } from "@/components/CompaniesListSkeleton";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutProps } from "@/lib/types";
import { Suspense } from "react";

export default function AppLayout({ children }: LayoutProps) {
  return (
    <>
      <main className="flex-1 flex-col w-full">
        <CompaniesHeader />
        <Suspense fallback={<AppLoading />}>
          <div className="mx-auto flex w-full max-w-5xl p-3">{children}</div>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

const AppLoading = () => {
  return (
    <div className="relative mx-auto flex w-full max-w-5xl p-3 mt-4 flex-1 flex-col gap-6 md:flex-row">
      <div className="flex h-fit shrink-0 flex-col gap-4 md:flex-col-reverse">
        <Skeleton className="h-52 w-full rounded-md md:w-60" />
      </div>
      <CompaniesListSkeleton />
    </div>
  );
};
