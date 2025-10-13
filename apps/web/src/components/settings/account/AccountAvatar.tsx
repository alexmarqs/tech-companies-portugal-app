"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RetroContainer } from "@/components/ui/retro-container";
import {
  UsersServerKeys,
  useGetUserProfile,
  useUploadUserAvatar,
} from "@/hooks/users";
import { useQueryClient } from "@tanstack/react-query";
import { CameraIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MAX_AVATAR_SIZE = 1024 * 1024 * 2; // 2MB
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export const AccountAvatar = () => {
  const { data: userProfile } = useGetUserProfile();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: mutateUserProfile, isPending: isMutatingUserProfile } =
    useUploadUserAvatar({
      onSuccess: () => {
        return queryClient.invalidateQueries({
          queryKey: [UsersServerKeys.GET_USER_PROFILE],
        });
      },
    });

  useEffect(() => {
    // on unmount, revoke the blob url
    return () => {
      if (previewUrl) {
        revokeBlobUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) {
      return;
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      toast.error("Please select a PNG, JPEG, or WEBP image.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error(
        `File size must be less than ${MAX_AVATAR_SIZE / 1024 / 1024}MB`,
      );
      return;
    }

    revokeBlobUrl(previewUrl);
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);

    mutateUserProfile(
      { file },
      {
        onError: () => {
          toast.error("Failed to upload avatar. Please try again.");
        },
      },
    );
  };

  return (
    <RetroContainer className="p-6 flex justify-between w-full items-center gap-1 flex-wrap">
      <div className="space-y-2 flex-1">
        <h3 className="text-md font-mono">Upload Avatar</h3>
        <p className="text-xs text-muted-foreground">
          Change your avatar. Click on the image to select and upload a new one.
        </p>
      </div>

      <Label
        htmlFor="avatar-input"
        className="relative cursor-pointer inline-block outline-none rounded-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
      >
        <Avatar className="h-20 w-20 flex-shrink-0">
          <AvatarImage
            className="object-cover"
            src={previewUrl ?? userProfile?.avatar_url ?? undefined}
            alt={
              previewUrl
                ? "Avatar Preview"
                : userProfile?.full_name
                  ? `${userProfile.full_name}'s avatar`
                  : "Avatar"
            }
            onError={() => {
              if (previewUrl) {
                revokeBlobUrl(previewUrl);
                setPreviewUrl(null);
              }
            }}
          />
          <AvatarFallback className="bg-muted text-muted-foreground font-medium">
            {userProfile?.full_name?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-none flex items-center justify-center shadow-md p-1 bg-white"
          aria-hidden
        >
          <CameraIcon className="h-3 w-3" />
        </div>
        {isMutatingUserProfile && (
          <div className="absolute inset-0 bg-gray-400 flex opacity-50 items-center justify-center rounded-full">
            <Loader2 className="h-3 w-3 animate-spin" />
          </div>
        )}
        <Input
          id="avatar-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handleUploadAvatar}
          disabled={isMutatingUserProfile}
        />
      </Label>
    </RetroContainer>
  );
};

const revokeBlobUrl = (url?: string | null) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};
