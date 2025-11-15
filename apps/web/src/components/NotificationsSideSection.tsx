import { SettingsTab } from "@/lib/search-params";
import Link from "next/link";
import { Button } from "./ui/button";
import { RetroContainer } from "./ui/retro-container";

export const NotificationsSideSection = () => {
  return (
    <RetroContainer
      variant="static-secondary"
      className="px-4 py-3 lg:w-[290px]"
    >
      <div className="flex flex-wrap items-center justify-center w-full gap-2">
        <div className="flex-1 min-w-[180px]">
          <h2 className="text-lg font-semibold">Stay updated 🔔</h2>
          <p className="text-xs text-muted-foreground">
            Get notified when new companies are added.
          </p>
        </div>
        <Button variant="default" size="sm" className="px-2" asChild>
          <Link href={`/settings?tab=${SettingsTab.NOTIFICATIONS}`} prefetch>
            Subscribe now
          </Link>
        </Button>
      </div>
    </RetroContainer>
  );
};
