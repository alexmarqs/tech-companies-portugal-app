"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  /** Path prefix that marks the link as active. Omit to never mark it. */
  activePrefix?: string;
  children: ReactNode;
};

export function NavLink({ href, activePrefix, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = activePrefix ? pathname.startsWith(activePrefix) : false;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex",
        isActive &&
          "text-foreground after:absolute after:inset-x-3 after:bottom-1 after:h-px after:bg-primary",
      )}
    >
      {children}
    </Link>
  );
}
