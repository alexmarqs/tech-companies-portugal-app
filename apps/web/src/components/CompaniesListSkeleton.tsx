import { Skeleton } from "./ui/skeleton";

const CompanyItemSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
      </div>
      <div className="flex items-center justify-between border-t border-border/40 pt-2">
        <Skeleton className="h-3 w-24 rounded" />
      </div>
    </div>
  );
};

export const CompaniesListSkeleton = () => {
  return (
    <div className="flex-1">
      <Skeleton className="h-8 w-48 rounded-lg mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <CompanyItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
