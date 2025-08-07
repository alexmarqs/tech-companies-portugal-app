"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserProfile } from "@/hooks/users";
import { AccountName } from "./AccountName";
import { DeleteAccount } from "./DeleteAccount";

export const AccountSettings = () => {
  const { isLoading: isLoadingUserProfile } = useGetUserProfile();

  if (isLoadingUserProfile) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <div className="space-y-6">
      <AccountName />
      <DeleteAccount />
    </div>
  );
};
