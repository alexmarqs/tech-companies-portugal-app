"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutateDeleteUser } from "@/hooks/users";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const CONFIRMATION_TEXT = "DELETE";

export const DeleteAccount = () => {
  const [confirmationText, setConfirmationText] = useState("");
  const router = useRouter();
  const [isPendingRedirect, startTransition] = useTransition();
  const supabase = createClient();

  const deleteUserMutation = useMutateDeleteUser({
    onSuccess: async () => {
      await supabase.auth.signOut();
      startTransition(() => {
        router.replace("/");
        // router.refresh();
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isLoading = deleteUserMutation.isPending || isPendingRedirect;

  return (
    <div className="p-6 space-y-4 border-red-500 border-2 border-solid bg-white">
      <div className="space-y-2">
        <h3 className="text-md font-mono">Delete Account</h3>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-2 mt-2">
            <Label htmlFor="confirmation">
              Type <span className="font-bold">{CONFIRMATION_TEXT}</span> to
              confirm
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteUserMutation.mutate()}
              disabled={
                confirmationText.trim() !== CONFIRMATION_TEXT || isLoading
              }
            >
              Confirm
              {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
