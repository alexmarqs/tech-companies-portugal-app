"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "./ui/button";

type BackButtonProps = Omit<ButtonProps, "onClick"> & {
  href?: string;
  label?: string;
  /**
   * If true, uses browser history navigation (router.back()).
   * If false or no history, falls back to href or "/".
   * @default false
   */
  useBrowserHistory?: boolean;
};

export const BackButton = ({
  href,
  label,
  useBrowserHistory = false,
  ...props
}: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (useBrowserHistory) {
      // Check if there's a referrer from the same origin
      const hasInternalReferrer =
        document.referrer &&
        new URL(document.referrer).origin === window.location.origin;

      // Check if we have meaningful history (more than just the current page)
      const hasHistory = window.history.length > 1;

      if (hasInternalReferrer && hasHistory) {
        router.back();
      } else {
        router.push(href || "/");
      }
    } else {
      router.push(href || "/");
    }
  };

  return (
    <Button
      aria-label={label || "Back"}
      size="sm"
      onClick={handleClick}
      {...props}
      className={cn("flex items-center gap-2", props.className)}
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
      {label || "Back"}
    </Button>
  );
};
