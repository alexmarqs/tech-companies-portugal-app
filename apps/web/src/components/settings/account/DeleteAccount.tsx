"use client";

import { Button } from "@/components/ui/button";
import { RetroContainer } from "@/components/ui/retro-container";

export const DeleteAccount = () => {
  return (
    <RetroContainer className="p-6" variant="destructive">
      <div className="space-y-4">
        <div className="border border-destructive/20 rounded-md p-4">
          <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button variant="destructive" onClick={() => {}} size="sm">
            Delete Account
          </Button>
        </div>
      </div>
    </RetroContainer>
  );
};
