import { Button } from "@/components/ui/button";
import {
  APP_URL,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import { ArrowLeft, BookOpen, FileJson } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next/types";

const title = "REST API | Tech Companies Portugal";
const description = "REST API for the Tech Companies Portugal directory";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    ...defaultOpenGraphMetadata,
    title,
    description,
    url: `${APP_URL}/integrations/api`,
  },
  twitter: {
    ...defaultTwitterMetadata,
    title,
    description,
  },
};

const exampleRequest = `curl "${APP_URL}/api/v1/companies?location=porto" \\
  -H "Authorization: Bearer $TCP_API_KEY"`;

export default function ApiPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border/60">
        <Link
          href="/integrations"
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3" />
          Integrations
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Build with the directory
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          A REST API for every company listed on Tech Companies Portugal. Every
          data request must be authenticated.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="/api-reference" target="_blank" rel="noreferrer">
              <BookOpen />
              API reference
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href="/api/v1/openapi.json"
              download="tech-companies-portugal-openapi.json"
            >
              <FileJson />
              Download OpenAPI spec
            </a>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-10 text-sm text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">
            Quick start
          </h2>
          <div className="flex flex-col gap-3">
            <pre className="overflow-x-auto rounded-md border border-border/60 bg-card px-4 py-3 font-mono text-xs text-foreground">
              {exampleRequest}
            </pre>
            <p>
              Responses are private and carry an{" "}
              <code className="font-mono text-xs">ETag</code>, so re-checking
              with <code className="font-mono text-xs">If-None-Match</code>{" "}
              avoids downloading an unchanged response. Authentication and
              rate-limit checks still run for every request. Every parameter,
              response field and error is documented in the{" "}
              <a
                href="/api-reference"
                target="_blank"
                className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
                rel="noreferrer"
              >
                API reference
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
