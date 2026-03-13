import { PUBLIC_CONTACT_EMAIL } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next/types";

const title = "Privacy Policy | Tech Companies Portugal";
const description =
  "Read the Privacy Policy for Tech Companies Portugal — discover tech companies hiring in Portugal, from startups to global tech companies.";

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

const LAST_UPDATED = "March 2026";

export default function PolicyPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border/60">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Legal
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* Table of contents */}
      <nav className="mb-10 p-4 rounded-lg bg-muted/50 border border-border/60">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          On this page
        </p>
        <ol className="flex flex-col gap-1.5">
          {[
            ["overview", "1. Overview"],
            ["data-collected", "2. Data We Collect"],
            ["analytics", "3. Analytics"],
            ["cookies", "4. Cookies & Local Storage"],
            ["third-parties", "5. Third-Party Services"],
            ["your-rights", "6. Your Rights"],
            ["data-retention", "7. Data Retention"],
            ["governing-law", "8. Governing Law"],
            ["contact", "9. Contact"],
          ].map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sections */}
      <div className="flex flex-col gap-10 text-sm text-foreground/80 leading-relaxed">
        <section id="overview" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            1. Overview
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              Tech Companies Portugal ("we", "us", or "our") operates an open
              directory of tech companies hiring in Portugal.
              This Privacy Policy explains how we handle information when you
              visit our website.
            </p>
            <p>
              We are committed to being transparent about our data practices. We
              collect only what is necessary to operate and improve the Service,
              and we do not sell personal data to third parties.
            </p>
          </div>
        </section>

        <section id="data-collected" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            2. Data We Collect
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              We collect minimal data required to run the Service. This
              includes:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>
                <strong className="text-foreground">Usage data</strong> — pages
                visited, search queries, and interactions with the directory,
                collected in aggregate and anonymised form via our analytics
                provider
              </li>
              <li>
                <strong className="text-foreground">Technical data</strong> —
                browser type, device type, and approximate geographic region
                derived from IP addresses (not stored in identifiable form)
              </li>
              <li>
                <strong className="text-foreground">
                  Voluntary submissions
                </strong>{" "}
                — if you submit a company listing or contact us, we may retain
                the information you provide for the purpose of processing your
                request
              </li>
            </ul>
            <p>
              When you create an account via OAuth sign-in (GitHub or Google),
              we receive and store your email address, display name, and profile
              picture from your identity provider. Anonymous visitors to the
              directory do not have any personally identifiable information
              collected or stored.
            </p>
          </div>
        </section>

        <section id="analytics" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            3. Analytics
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              We use PostHog to understand how visitors use the Service. PostHog
              collects anonymised event data such as page views and feature
              interactions. This data helps us improve the directory experience.
            </p>
            <p>
              PostHog is configured in &ldquo;identified-only&rdquo; mode:
              anonymous visitors are not individually profiled. Authenticated
              users may be associated with their activity within PostHog. No
              sensitive personal data (passwords, payment info) is sent. For
              more information, see the{" "}
              <a
                href="https://posthog.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                PostHog Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>

        <section id="cookies" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            4. Cookies & Local Storage
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              We use a minimal number of cookies and browser storage mechanisms
              to support core functionality:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>
                <strong className="text-foreground">Analytics cookies</strong>{" "}
                — set by PostHog to distinguish unique sessions and measure
                usage patterns
              </li>
              <li>
                <strong className="text-foreground">Preference storage</strong>{" "}
                — local storage may be used to remember UI preferences such as
                theme or filter state
              </li>
              <li>
                <strong className="text-foreground">Session cookies</strong> —
                set by Supabase to maintain your login session when you sign in;
                cleared when you sign out or delete your account
              </li>
            </ul>
            <p>
              We do not use advertising, tracking, or third-party marketing
              cookies.
            </p>
          </div>
        </section>

        <section id="third-parties" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            5. Third-Party Services
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              The Service integrates with the following third-party providers,
              each with their own privacy practices:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>
                <strong className="text-foreground">Supabase</strong> — used
                for database and authentication infrastructure
              </li>
              <li>
                <strong className="text-foreground">PostHog</strong> — used for
                product analytics
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> — used to
                host and serve the application; may process IP addresses as
                part of request handling
              </li>
              <li>
                <strong className="text-foreground">Plunk</strong> — used to
                send transactional and notification emails (welcome email on
                sign-up and weekly digest for opted-in users)
              </li>
              <li>
                <strong className="text-foreground">Arcjet</strong> — used for
                rate limiting and security protection; processes request
                metadata but does not store personal data
              </li>
              <li>
                <strong className="text-foreground">Upstash Redis</strong> —
                used for server-side caching; does not store personal data
              </li>
              <li>
                <strong className="text-foreground">Inngest</strong> — used to
                process background jobs such as sending weekly digests; handles
                user IDs and email addresses to dispatch emails
              </li>
              <li>
                <strong className="text-foreground">Logos.dev</strong> — used to
                fetch company logo images based on domain names; no personal
                data is involved
              </li>
            </ul>
            <p>
              We encourage you to review the privacy policies of these providers
              if you have concerns about how they handle data.
            </p>
          </div>
        </section>

        <section id="your-rights" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            6. Your Rights
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              Under applicable data protection law, including the GDPR where
              relevant, you may have the right to:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p>
              Because we collect very little personal data, most requests can be
              handled quickly. To exercise any of these rights, please contact
              us via the channels listed in Section 9.
            </p>
          </div>
        </section>

        <section id="data-retention" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            7. Data Retention
          </h2>
          <p>
            Anonymised analytics data is retained for as long as necessary to
            understand usage trends. Account data (email address, display name,
            and avatar) is retained for as long as your account is active. You
            may delete your account at any time via the Settings page, which
            permanently removes your profile data and avatar from our systems.
          </p>
        </section>

        <section id="governing-law" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            8. Governing Law
          </h2>
          <p>
            This Privacy Policy is governed by and construed in accordance with
            the laws of Portugal and applicable EU data protection regulations,
            including the General Data Protection Regulation (GDPR).
          </p>
        </section>

        <section id="contact" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            9. Contact
          </h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise
            your data rights, please reach out via{" "}
            <a
              href="https://github.com/alexmarqs/tech-companies-portugal"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              GitHub
            </a>{" "}
            on{" "}
            <a
              href="https://x.com/alexlmarques"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              X / Twitter
            </a>
            , or email us at{" "}
            <a
              href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
              className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              {PUBLIC_CONTACT_EMAIL}
            </a>
            . You may also review our{" "}
            <Link
              href="/terms"
              className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Terms of Service
            </Link>
            .
          </p>
        </section>
      </div>

      {/* Footer note */}
      <div className="mt-12 pt-8 border-t border-border/60">
        <p className="text-xs text-muted-foreground">
          This policy was last reviewed in {LAST_UPDATED}. Previous versions
          are available in the{" "}
          <a
            href="https://github.com/alexmarqs/tech-companies-portugal"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Git history
          </a>
          .
        </p>
      </div>
    </div>
  );
}
