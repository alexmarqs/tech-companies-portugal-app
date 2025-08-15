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
import { Loader2, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SocialIcons } from "./SocialIcons";
import { useSession } from "./hooks/useSession";
import { Skeleton } from "./ui/skeleton";

export function UserMenu() {
  const { session, isLoading, isSigningOut, signOut } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/login?from=logout");
    } catch (error) {
      console.error("Unexpected error during logout:", error);
    }
  };

  if (!isLoading && !session) {
    return (
      <>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <a
            href="https://github.com/alexmarqs/frontend-tech-companies-portugal"
            target="_blank"
            rel="noreferrer noopener"
            className="!px-2"
            aria-label="View project on GitHub"
          >
            <SocialIcons icon="github" />
          </a>
        </Button>
      </>
    );
  }

  return isLoading ? (
    <Skeleton className="h-8 w-8 rounded-full" />
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            {session?.user?.user_metadata?.avatar_url ? (
              <AvatarImage
                src={session?.user.user_metadata.avatar_url}
                alt={session?.user.user_metadata.full_name ?? ""}
              />
            ) : (
              <AvatarFallback className="bg-muted text-muted-foreground font-medium text-xs">
                {session?.user?.user_metadata?.full_name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">
              {session?.user?.user_metadata?.full_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            prefetch
            className="flex items-center hover:cursor-pointer"
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
          >
            <SocialIcons icon="github" className="mr-2" />
            GitHub
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 hover:cursor-pointer"
          onClick={handleLogout}
          disabled={isLoading || isSigningOut}
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
