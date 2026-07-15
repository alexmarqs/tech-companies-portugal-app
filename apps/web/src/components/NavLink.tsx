"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      prefetch
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative hidden md:inline-flex items-center text-sm font-medium transition-colors",
        isActive
          ? "text-foreground after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:rounded-full after:bg-emerald-500/80"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
