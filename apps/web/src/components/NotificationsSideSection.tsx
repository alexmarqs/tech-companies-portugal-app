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
  const href = `/settings?tab=${SettingsTab.NOTIFICATIONS}`;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        prefetch
        className={cn(
          "group flex items-center gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/50 px-4 py-2.5 transition-colors hover:bg-emerald-50",
          className,
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Bell size={15} />
        </span>
        <span className="flex-1 text-sm font-medium text-foreground">
          New tech companies, straight to your inbox
        </span>
        <span className="shrink-0 text-sm font-semibold text-emerald-700 transition-colors group-hover:text-emerald-800">
          Subscribe →
        </span>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-emerald-200/70 bg-linear-to-r from-emerald-50/70 to-card p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25">
          <Mail size={22} strokeWidth={2} />
        </div>

        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-bold leading-snug text-foreground">
            New companies, in your inbox
          </h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Get the latest tech companies added in Portugal — free, no spam.
          </p>
        </div>
      </div>

      <Button
        size="sm"
        className="shrink-0 rounded-lg bg-emerald-600 px-4 text-white shadow-sm transition-colors hover:bg-emerald-700"
        asChild
      >
        <Link href={href} prefetch>
          Subscribe free
        </Link>
      </Button>
    </div>
  );
};
