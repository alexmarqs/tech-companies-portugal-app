"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/contexts/SessionContext";
import { SettingsTab } from "@/lib/search-params";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";

export function DirectoryActions() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          size="lg"
          className="w-full rounded-full px-6 sm:w-auto"
          asChild
        >
          <Link href="/login">
            Join the community
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full rounded-full bg-card/70 px-6 sm:w-auto"
          asChild
        >
          <a href="#directory">Explore companies</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <Button
        size="lg"
        className="w-full rounded-full px-6 shadow-lg shadow-primary/20 sm:w-auto"
        asChild
      >
        <Link
          href={
            isAuthenticated
              ? `/settings?tab=${SettingsTab.NOTIFICATIONS}`
              : "/login"
          }
        >
          {isAuthenticated ? (
            <Bell data-icon="inline-start" aria-hidden="true" />
          ) : null}
          {isAuthenticated ? "Manage updates" : "Join the community"}
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-full rounded-full bg-card/70 px-6 sm:w-auto"
        asChild
      >
        <a href="#directory">Explore companies</a>
      </Button>
    </div>
  );
}
