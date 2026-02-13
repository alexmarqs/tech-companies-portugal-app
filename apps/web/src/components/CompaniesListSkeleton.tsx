import { Skeleton } from "./ui/skeleton";

export const CompaniesListSkeleton = () => {
  return (
    <div className="flex-1">
      <Skeleton className="h-8 w-48 rounded-lg mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    </div>
  );
};
