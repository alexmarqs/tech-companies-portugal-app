"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const CopyUrlButton = () => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
  };

  return (
    <Button
      className="h-8 rounded-md px-2 text-xs"
      onClick={handleClick}
      aria-label="Copy URL"
    >
      {isCopied ? (
        <Check className="shrink-0" size={16} aria-hidden="true" />
      ) : (
        <Copy className="shrink-0" size={16} aria-hidden="true" />
      )}
      <span className="hidden sm:ml-1 sm:block">
        {isCopied ? "Copied!" : "Copy URL"}
      </span>
    </Button>
  );
};
