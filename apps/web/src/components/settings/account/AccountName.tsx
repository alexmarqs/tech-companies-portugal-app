"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RetroContainer } from "@/components/ui/retro-container";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserProfile } from "@/hooks/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  full_name: z
    .string()
    .min(1, {
      message: "Required",
    })
    .max(30, { message: "Max. 30 characters" }),
});

export const AccountName = () => {
  const { data: userProfile, isLoading } = useGetUserProfile();

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: userProfile?.full_name || "",
    },
  });

  return (
    <RetroContainer className="p-6">
      <form onSubmit={() => {}} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            type="text"
            placeholder="Enter your full name"
            value={userProfile?.full_name || ""}
            onChange={(e) => {}}
          />
        </div>

        <div className="flex justify-start items-center gap-4 flex-wrap">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
          {form.formState.errors.full_name && (
            <p className="text-xs text-red-500">
              {form.formState.errors.full_name?.message}
            </p>
          )}
        </div>
      </form>
    </RetroContainer>
  );
};
