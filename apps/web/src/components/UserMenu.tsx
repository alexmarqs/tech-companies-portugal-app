"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/useSession";
import { useGetUserProfile } from "@/hooks/users";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { trackEvent } from "@tech-companies-portugal/analytics/client";
import { Loader2, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SocialIcons } from "./SocialIcons";
import { Skeleton } from "./ui/skeleton";

export function UserMenu() {
  const router = useRouter();
  const supabase = createClient();
  const { isAuthenticated, isLoading: sessionLoading } = useSession();
  const { data: userProfile, isPending } = useGetUserProfile({
    enabled: isAuthenticated,
  });
  const [isSigningOut, setIsSigningOut] = useState(false);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      router.replace("/login?from=logout");
      queryClient.clear();
    } catch (error) {
      console.error("Unexpected error during logout:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Show skeleton while session is loading OR profile is loading for authenticated users
  if (sessionLoading || (isAuthenticated && isPending)) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Button asChild>
          <Link
            onClick={() => trackEvent("login_button_clicked")}
            href="/login"
          >
            Login
          </Link>
        </Button>
        <Button asChild>
          <a
            href="https://github.com/alexmarqs/frontend-tech-companies-portugal"
            target="_blank"
            rel="noreferrer noopener"
            className="!px-[10px]"
            aria-label="View project on GitHub"
            onClick={() => trackEvent("github_button_clicked")}
          >
            <SocialIcons icon="github" />
          </a>
        </Button>
      </>
    );
  }

  // Show user menu (authenticated and profile loaded)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userProfile?.avatar_url ?? undefined}
              alt={
                userProfile?.full_name
                  ? `${userProfile.full_name}'s avatar`
                  : "Avatar"
              }
            />
            <AvatarFallback className="bg-muted text-muted-foreground font-medium">
              {userProfile?.full_name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">
              {userProfile?.full_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {userProfile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            prefetch
            className="flex items-center hover:cursor-pointer"
            onClick={() => trackEvent("settings_button_clicked")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/alexmarqs/frontend-tech-companies-portugal"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center hover:cursor-pointer"
            aria-label="View project on GitHub"
            onClick={() => trackEvent("logged_in_github_button_clicked")}
          >
            <SocialIcons icon="github" className="mr-2" />
            GitHub
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 hover:cursor-pointer"
          onClick={handleLogout}
          disabled={isPending || isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          {isSigningOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
