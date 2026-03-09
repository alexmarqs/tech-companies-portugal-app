import { SettingsTab } from "@/lib/search-params";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const NotificationsSideSection = () => {
  return (
    <div className="w-full lg:w-[300px] rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900">
            New companies, straight to your inbox
          </h2>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Stay ahead — get a weekly update with the latest companies added.
        </p>
        <Button
          size="sm"
          className="w-full mt-1 bg-emerald-500 text-white hover:bg-emerald-600"
          asChild
        >
          <Link href={`/settings?tab=${SettingsTab.NOTIFICATIONS}`} prefetch>
            <Bell size={14} className="mr-1.5" />
            Subscribe Now
          </Link>
        </Button>
        <p className="text-[11px] text-gray-400 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};
