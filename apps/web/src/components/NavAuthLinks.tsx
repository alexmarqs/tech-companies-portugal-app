"use client";

import { useSession } from "@/lib/contexts/SessionContext";
import { NavLink } from "./NavLink";

// Desktop-only nav links surfaced when the user is authenticated. These mirror
// the authenticated entries in the UserMenu dropdown for quicker access.
export function NavAuthLinks() {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return null;
  }

  return <NavLink href="/my-companies">My Companies</NavLink>;
}
