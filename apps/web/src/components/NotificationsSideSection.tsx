import Link from "next/link";
import { Button } from "./ui/button";
import { RetroContainer } from "./ui/retro-container";

export const NotificationsSideSection = () => {
  return (
    <RetroContainer
      variant="static-secondary"
      className="px-4 py-3 lg:w-[290px]"
    >
      <div className="space-y-3 text-center">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          Weekly Email Digest 📧
        </h2>
        <p className="text-sm text-muted-foreground">
          Never miss out on the latest tech companies in Portugal.
        </p>
        <Button variant="default" size="sm" className="w-full" asChild>
          <Link href="/settings?tab=notifications" prefetch>
            Manage notifications
          </Link>
        </Button>
      </div>
    </RetroContainer>
  );
};
