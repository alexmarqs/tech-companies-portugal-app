import {
  APP_URL,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/utils";
import type { Metadata } from "next/types";

const title = "About | Tech Companies Portugal";
const description =
  "Learn about Tech Companies Portugal — discover tech companies hiring in Portugal, from startups to global tech companies.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    ...defaultOpenGraphMetadata,
    title,
    description,
    url: `${APP_URL}/about`,
  },
  twitter: {
    ...defaultTwitterMetadata,
    title,
    description,
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border/60">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          About
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Hey, glad you&apos;re here!
        </h1>
        <p className="text-sm text-muted-foreground">
          A little backstory on Tech Companies Portugal
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-10 text-sm text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">
            How it started
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              I&apos;m{" "}
              <a
                href="https://alexandremarques.io"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                Alexandre Marques
              </a>
              , a Product / Software Engineer based in Portugal. At some point I
              came across the amazing open-source{" "}
              <a
                href="https://github.com/marmelo/tech-companies-in-portugal"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                tech-companies-in-portugal
              </a>{" "}
              repository — a community-maintained list of tech companies in
              Portugal. It was exactly what I was looking for, but it lived only
              on GitHub as a raw dataset. So I decided to build a proper web
              interface on top of it, making it searchable, browsable, and
              actually useful for everyone — not just developers comfortable
              reading markdown files.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-4">
            What it is today
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              Tech Companies Portugal is a directory of tech companies in
              Portugal, from early-stage startups to global companies with
              teams here. Search by name, or browse by category and location to
              find who&apos;s building what, and where.
            </p>
            <p>
              It&apos;s a side project that keeps evolving: new features and
              improvements land as it grows. If you have an idea for what it
              should do next, I&apos;d love to hear it.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-4">
            Get in touch
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              Got a question, an idea, or just want to say hi? You can find me
              on{" "}
              <a
                href="https://x.com/alexlmarques"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                X / Twitter
              </a>
              ,{" "}
              <a
                href="https://www.linkedin.com/in/alexandre-marques-ba87a877"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                LinkedIn
              </a>
              , via the project&apos;s{" "}
              <a
                href="https://github.com/alexmarqs/tech-companies-portugal"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                GitHub{" "}
              </a>
              or email me at{" "}
              <a
                href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
                className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                {PUBLIC_CONTACT_EMAIL}
              </a>
              . I&apos;d love to hear from you.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
