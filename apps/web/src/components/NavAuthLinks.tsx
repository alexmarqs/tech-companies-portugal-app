"use client";

import { useSession } from "@/lib/contexts/SessionContext";
import Link from "next/link";

// Desktop-only nav links surfaced when the user is authenticated. These mirror
// the authenticated entries in the UserMenu dropdown for quicker access.
export function NavAuthLinks() {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link
      href="/my-companies"
      prefetch
      className="hidden md:inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      My Companies
    </Link>
  );
}
