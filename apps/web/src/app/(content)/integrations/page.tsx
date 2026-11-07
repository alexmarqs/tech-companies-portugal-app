import { Badge } from "@/components/ui/badge";
import {
  APP_URL,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bot,
  Braces,
  type LucideIcon,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next/types";

const title = "Integrations | Tech Companies Portugal";
const description =
  "Use the Tech Companies Portugal directory in your AI assistant, your code or your terminal";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    ...defaultOpenGraphMetadata,
    title,
    description,
    url: `${APP_URL}/integrations`,
  },
  twitter: {
    ...defaultTwitterMetadata,
    title,
    description,
  },
};

type Integration = {
  name: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href?: string; // Omitted while the integration isn't available yet.
};

const integrations: Integration[] = [
  {
    name: "REST API",
    label: "HTTP",
    description:
      "A REST API to build the directory into your own app or service.",
    icon: Braces,
    href: "/integrations/api",
  },
  {
    name: "AI assistants",
    label: "MCP",
    description:
      "Ask Claude, ChatGPT or Cursor about Portuguese tech companies while you research, recruit or job hunt.",
    icon: Bot,
  },
  {
    name: "Command line",
    label: "CLI",
    description: "Search and filter companies straight from your terminal.",
    icon: Terminal,
  },
];

function IntegrationCard({
  integration: { name, label, description, icon: Icon, href },
}: {
  integration: Integration;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-background text-primary">
          <Icon className="size-5" />
        </div>
        {href ? null : (
          <Badge
            variant="secondary"
            className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          >
            Soon
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <h2 className="text-base font-bold text-foreground">{name}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {href ? (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Get started
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      ) : null}
    </>
  );

  const className =
    "flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5";

  if (!href) {
    return (
      <div aria-disabled="true" className={cn(className, "opacity-60")}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        className,
        "group transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_16px_36px_-28px_oklch(0.3_0.04_40/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {content}
    </Link>
  );
}

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border/60">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Integrations
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Use the directory anywhere
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Bring every company listed on Tech Companies Portugal into your AI
          assistant, your code or your terminal.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.name} integration={integration} />
        ))}
      </div>
    </div>
  );
}
