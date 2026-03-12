import { PUBLIC_CONTACT_EMAIL } from "@/lib/utils";
import type { Metadata } from "next/types";

const title = "About · Tech Companies Portugal";
const description =
  "Learn about Tech Companies Portugal — the open directory of tech companies, startups, and scale-ups in Portugal.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
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
                Alexandre
              </a>
              , a Software Engineer based in Portugal. At some point I came
              across the amazing open-source{" "}
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
              Tech Companies Portugal is a directory of tech companies,
              startups, and scale-ups across Portugal. You can search by name,
              filter by category or location, and discover companies from Lisbon
              and Porto all the way to Braga, Coimbra, Aveiro, and everywhere in
              between.
            </p>
            <p>
              If you create an account (via GitHub or Google), you can also
              subscribe to a weekly email digest to stay up to date with newly
              listed companies. No spam, no ads — just a simple notification
              when new companies show up.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-4">
            Built in the open
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              The entire project is open source — the web app, the dataset, all
              of it. The tech stack is something I genuinely enjoy working with,
              including: Next.js, Tailwind CSS, Shadcn UI, Supabase, PostHog,
              and a bunch of other cool tools!
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
