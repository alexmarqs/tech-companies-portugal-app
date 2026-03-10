"use client";

import { trackEvent } from "@tech-companies-portugal/analytics/client";
import { Button } from "./ui/button";

export const LinkUrlButton = ({
  url,
  icon,
  label,
  companyName,
}: {
  url?: string;
  icon: React.ReactNode;
  label: string;
  companyName: string;
}) => {
  if (!url) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      className="h-8 px-2 text-xs hover:bg-secondary/60"
      asChild
    >
      <a
        href={url}
        // biome-ignore lint/a11y/noBlankTarget: intentionally sending referrer for attribution
        target="_blank"
        rel="noopener"
        onClick={() => {
          trackEvent("company_website_clicked", {
            company_name: companyName,
            link_type: label.toLowerCase(),
            url,
          });
        }}
      >
        <div className="flex items-center gap-1">
          {icon}
          {label}
        </div>
      </a>
    </Button>
  );
};
