import { Skeleton } from "./ui/skeleton";

export const CompaniesListSkeleton = () => {
  return (
    <div className="flex-1 space-y-4">
      <Skeleton className="h-36 w-full rounded-md" />
      <Skeleton className="h-36 w-full rounded-md" />
      <Skeleton className="h-36 w-full rounded-md" />
    </div>
  );
};
