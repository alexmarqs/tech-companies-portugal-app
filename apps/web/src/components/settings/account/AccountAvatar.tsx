"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RetroContainer } from "@/components/ui/retro-container";
import { useGetUserProfile } from "@/hooks/users";
import { useQueryClient } from "@tanstack/react-query";
import { CameraIcon } from "lucide-react";

export const AccountAvatar = () => {
  const { data: userProfile } = useGetUserProfile();
  const queryClient = useQueryClient();
  //const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);
  // const { mutate: mutateUserProfile, isPending: isMutatingUserProfile } =
  //   useMutateUserProfile({
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({
  //         queryKey: [UsersServerKeys.GET_USER_PROFILE],
  //       });
  //     },
  //   });

  return (
    <RetroContainer className="p-6 flex justify-between w-full items-center gap-1">
      <div className="space-y-2 flex-1">
        <h3 className="text-md font-mono">Upload Avatar</h3>
        <p className="text-xs text-muted-foreground">
          Change your avatar. Click on the image to select and upload a new one.
        </p>
      </div>
      <div className="relative flex-shrink-0 cursor-pointer">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={userProfile?.avatar_url ?? undefined}
            alt={userProfile?.full_name ?? undefined}
          />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {userProfile?.full_name
              ?.split(" ")
              .map((name: string) => name[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
          <input
            //ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            multiple={false}
            onChange={() => {}}
          />
        </Avatar>
        <div
          className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-none flex items-center justify-center shadow-md p-1 bg-white"
          title="Upload avatar"
        >
          <CameraIcon className="h-3 w-3" />
        </div>
      </div>
    </RetroContainer>
  );
};
