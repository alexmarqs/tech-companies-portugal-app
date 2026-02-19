"use client";

import { Check, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export const CopyUrlButton = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const isSharingRef = useRef(false);

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const handleClick = async () => {
    if (canShare) {
      if (isSharingRef.current) return;
      isSharingRef.current = true;
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          navigator.clipboard.writeText(window.location.href);
          setIsCopied(true);
        }
      } finally {
        isSharingRef.current = false;
      }
      return;
    }

    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
  };

  const icon = isCopied ? (
    <Check className="shrink-0" size={14} aria-hidden="true" />
  ) : (
    <Share2 className="shrink-0" size={14} aria-hidden="true" />
  );

  const label = isCopied ? "Copied!" : "Share";

  return (
    <Button
      className="h-8 rounded-md px-4 text-xs"
      onClick={handleClick}
      aria-label={label}
      variant="outline"
    >
      {icon}
      <span className="hidden sm:ml-1 sm:block">{label}</span>
    </Button>
  );
};
