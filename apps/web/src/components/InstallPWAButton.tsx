"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Share } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const IS_IOS_USER_AGENT_REGEX = /iphone|ipad|ipod/i;

export function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
    null,
  );
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    setIsIos(IS_IOS_USER_AGENT_REGEX.test(navigator.userAgent));
    setIsInstalled(standalone);

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    const handleInstalled = () => setIsInstalled(true);

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const install = async () => {
    if (!installPrompt) {
      setShowIosHelp(true);
      return;
    }

    // the event is single-use: a second prompt() call rejects, so drop it now
    // and let the next click fall through to the manual instructions
    setInstallPrompt(null);

    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch {
      setShowIosHelp(true);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="rounded-full px-2.5 text-xs text-primary sm:hidden"
        onClick={install}
      >
        <Download data-icon="inline-start" aria-hidden="true" />
        Get app
      </Button>
      <Dialog open={showIosHelp} onOpenChange={setShowIosHelp}>
        <DialogContent className="w-[calc(100%-2rem)] rounded-3xl border-primary/15">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle>Install App</DialogTitle>
            <DialogDescription className="leading-relaxed">
              {isIos
                ? "In Safari, tap Share, then choose “Add to Home Screen”."
                : "Open your browser menu and choose “Install app” or “Add to Home Screen”."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 rounded-2xl bg-accent p-4 text-sm font-medium text-accent-foreground">
            <Share className="size-5 text-primary" aria-hidden="true" />
            {isIos
              ? "Share → Add to Home Screen"
              : "Browser menu → Install app"}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
