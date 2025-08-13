"use client";

import { Button } from "@/components/ui/button";
import { RetroContainer } from "@/components/ui/retro-container";

export const DeleteAccount = () => {
  return (
    <RetroContainer className="p-6 space-y-4" variant="destructive">
      <div className="space-y-2">
        <h3 className="text-md font-mono">Delete Account</h3>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
      </div>

      <Button variant="destructive" onClick={() => {}} size="sm">
        Delete Account
      </Button>
    </RetroContainer>
  );
};
