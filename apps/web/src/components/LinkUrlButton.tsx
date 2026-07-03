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
      data-ph-capture-attribute-event-name="company_website_clicked"
      data-ph-capture-attribute-company-name={companyName}
      data-ph-capture-attribute-link-type={label.toLowerCase()}
      data-ph-capture-attribute-url={url}
    >
      <a
        href={url}
        // biome-ignore lint/a11y/noBlankTarget: intentionally sending referrer for attribution
        target="_blank"
        rel="noopener"
        className="flex items-center gap-1"
      >
        {icon}
        {label}
      </a>
    </Button>
  );
};
