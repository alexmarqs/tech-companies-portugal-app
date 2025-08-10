"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RetroContainer } from "@/components/ui/retro-container";
import {
  UsersServerKeys,
  useGetUserProfile,
  useMutateUserProfile,
} from "@/hooks/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, {
      message: "Required",
    })
    .max(30, { message: "Max. 30 characters" }),
});

export const AccountName = () => {
  const { data: userProfile } = useGetUserProfile();

  const { mutate: mutateUserProfile, isPending: isMutatingUserProfile } =
    useMutateUserProfile();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: userProfile?.full_name ?? "",
    },
  });

  const onSubmit = form.handleSubmit((submittedData) => {
    mutateUserProfile(
      {
        data: {
          full_name: submittedData.full_name,
        },
      },
      {
        onSuccess: () => {
          toast.success("User profile updated");
          form.reset({ full_name: submittedData.full_name });
        },
        onError: () => {
          toast.error("Failed to update user profile");
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: [UsersServerKeys.GET_USER_PROFILE],
          });
        },
      },
    );
  });

  return (
    <RetroContainer className="p-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isMutatingUserProfile}
                    placeholder="Enter your full name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-start items-center gap-4 flex-wrap">
            <Button
              type="submit"
              disabled={isMutatingUserProfile || !form.formState.isDirty}
              className="flex items-center gap-2"
            >
              {isMutatingUserProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </RetroContainer>
  );
};
