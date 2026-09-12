"use client";

import { useSession } from "@/lib/contexts/SessionContext";
import { SettingsTab } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { Bell, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

type NotificationsSideSectionProps = {
  className?: string;
  // "full": the feature banner (home grid). "compact": a slim inline CTA for
  // content pages where a full banner is too heavy.
  variant?: "full" | "compact";
};

export const NotificationsSideSection = ({
  className,
  variant = "full",
}: NotificationsSideSectionProps) => {
  const { isAuthenticated } = useSession();

  const href = isAuthenticated
    ? `/settings?tab=${SettingsTab.NOTIFICATIONS}`
    : "/login";

  if (variant === "compact") {
    return (
      <Link
        href={href}
        prefetch
        className={cn(
          "group flex items-center gap-3 rounded-xl border border-primary/15 bg-accent/60 px-4 py-2.5 transition-colors hover:bg-accent",
          className,
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bell className="size-4" />
        </span>
        <span className="flex-1 text-sm font-medium text-foreground">
          {isAuthenticated
            ? "New tech companies, straight to your inbox"
            : "Join the Portugal tech community"}
        </span>
        <span className="shrink-0 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
          {isAuthenticated ? "Manage updates →" : "Join free →"}
        </span>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-primary/15 bg-accent/65 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
          <Mail className="size-5" strokeWidth={2} />
        </div>

        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-bold leading-snug text-foreground">
            {isAuthenticated
              ? "New companies, in your inbox"
              : "Your shortcut to Portugal's tech scene"}
          </h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {isAuthenticated
              ? "Get the latest tech companies added in Portugal, free, no spam."
              : "Create a free profile for the weekly digest—and be first in line when Jobs launches."}
          </p>
        </div>
      </div>

      <Button size="sm" className="shrink-0 rounded-xl px-4 shadow-sm" asChild>
        <Link href={href} prefetch>
          <Bell data-icon="inline-start" />
          {isAuthenticated ? "Manage updates" : "Join free"}
        </Link>
      </Button>
    </div>
  );
};
