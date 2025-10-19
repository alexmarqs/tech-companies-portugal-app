"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@tech-companies-portugal/analytics/client";
import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) || window.innerWidth <= 768;

    if (!isMobile) {
      return;
    }

    // Check if already dismissed
    // If dismissed in the last 7 days, don't show the prompt again
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    try {
      if (
        dismissed &&
        Date.now() - Number.parseInt(dismissed) < 1000 * 60 * 60 * 24 * 7
      ) {
        return;
      }
    } catch (error) {
      console.error("Error parsing dismissed timestamp:", error);
    }

    // Detect installed state (works across browsers including older iOS)
    const nav = navigator as Navigator & { standalone?: boolean };
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (typeof nav.standalone !== "undefined" && nav.standalone === true);
    if (isStandalone) {
      return;
    }

    // Detect iOS device (Safari/Chrome on iOS both match UA)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);

    setIsIOS(isIOSDevice);

    // Handle beforeinstallprompt event (for Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show prompt after a short delay
    let timerIOS: NodeJS.Timeout | undefined;
    if (isIOSDevice) {
      timerIOS = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    }

    // Hide prompt after app is installed (non-iOS only)
    const handleAppInstalled = () => {
      trackEvent("pwa_installed", {
        method: "native_prompt",
      });
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    if (!isIOSDevice) {
      window.addEventListener("appinstalled", handleAppInstalled);
    }

    // Unified cleanup - always removes listeners and conditionally clears timer
    return () => {
      if (timerIOS) {
        clearTimeout(timerIOS);
      }
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    trackEvent("pwa_install_clicked", {
      platform: isIOS ? "ios" : "android_chrome",
    });

    // Make sure we have the saved event
    if (!deferredPrompt) {
      return;
    }

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to choose to install or not
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    trackEvent("pwa_banner_dismissed", {
      platform: isIOS ? "ios" : "android_chrome",
    });

    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:bottom-2 md:right-2 md:left-auto">
      <div className="relative flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-lg">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-md p-1 hover:bg-accent"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pr-8 sm:pr-0">
          <h3 className="text-sm font-semibold">Install App</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isIOS
              ? "Tap the Share button and select 'Add to Home Screen'"
              : "Install Tech Companies Portugal for quick access"}
          </p>
        </div>

        {!isIOS && deferredPrompt && (
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="shrink-0 w-full"
            aria-label="Install app"
          >
            <Download className="mr-2 h-4 w-4" />
            Install
          </Button>
        )}
      </div>
    </div>
  );
};
