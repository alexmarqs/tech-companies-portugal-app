"use client";

import { AccountName } from "./AccountName";
import { DeleteAccount } from "./DeleteAccount";

export const AccountSettings = () => {
  return (
    <div className="space-y-6">
      <AccountName />
      <DeleteAccount />
    </div>
  );
};
