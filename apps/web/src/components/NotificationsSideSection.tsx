import { SettingsTab } from "@/lib/search-params";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const NotificationsSideSection = () => {
  return (
    <div className="w-full lg:w-[300px] rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
            <Bell size={16} />
          </div>
          <h2 className="text-base font-bold">Stay updated</h2>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          Receive updates to stay ahead of the curve of new tech companies in
          Portugal.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-1 bg-emerald-500 text-white hover:bg-emerald-400 border-none font-semibold"
          asChild
        >
          <Link href={`/settings?tab=${SettingsTab.NOTIFICATIONS}`} prefetch>
            <Bell size={14} className="mr-1.5" />
            Subscribe Now
          </Link>
        </Button>
        <p className="text-[11px] text-white/50 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};
