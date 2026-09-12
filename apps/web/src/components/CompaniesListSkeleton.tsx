import { Skeleton } from "./ui/skeleton";

const CompanyItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5">
      <Skeleton className="size-14 shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
    </div>
  );
};

export const CompaniesListSkeleton = () => {
  return (
    <div className="flex-1">
      <Skeleton className="mb-5 h-8 w-48 rounded-lg" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <CompanyItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
