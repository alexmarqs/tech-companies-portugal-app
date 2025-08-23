"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserProfile } from "@/hooks/users";
import { AccountAvatar } from "./AccountAvatar";
import { AccountName } from "./AccountName";
import { DeleteAccount } from "./DeleteAccount";

export const AccountSettings = () => {
  const { isPending } = useGetUserProfile();

  if (isPending) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <div className="space-y-6">
      <AccountAvatar />
      <AccountName />
      <DeleteAccount />
    </div>
  );
};
