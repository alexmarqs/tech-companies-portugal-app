import { SettingsTab } from "@/lib/search-params";
import { Bell, BellRing } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const NotificationsSideSection = () => {
  return (
    <div className="w-full lg:w-[300px] rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600">
            <BellRing size={16} />
          </div>
          <h2 className="text-base font-bold text-gray-900">Stay updated</h2>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Receive updates to stay ahead of the curve of new tech companies in
          Portugal.
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
