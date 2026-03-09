import { SettingsTab } from "@/lib/search-params";
import { Bell, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const NotificationsSideSection = () => {
  return (
    <div className="group relative w-full lg:w-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-[1px]">
      {/* Inner card */}
      <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 p-5">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-emerald-200/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-4 -left-4 size-20 rounded-full bg-teal-200/25 blur-xl" />

        <div className="relative flex flex-row justify-between items-start lg:flex-col gap-4 flex-wrap">
          <div className="flex flex-col items-start gap-2 shrink-0">
            {/* Icon badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-200/60">
              <Sparkles size={12} className="fill-emerald-500 text-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wide">
                Weekly digest
              </span>
            </div>

            <h2 className="text-[15px] font-bold leading-snug text-gray-900">
              New companies, straight to your inbox
            </h2>
            <p className="text-[13px] leading-relaxed text-gray-500">
              Stay ahead — get a weekly update with the latest companies added.
            </p>
          </div>

          <Button
            size="sm"
            className="mt-0.5 rounded-lg bg-emerald-600 px-4 text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25"
            asChild
          >
            <Link href={`/settings?tab=${SettingsTab.NOTIFICATIONS}`} prefetch>
              <Bell size={14} className="mr-1.5" />
              Subscribe Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
