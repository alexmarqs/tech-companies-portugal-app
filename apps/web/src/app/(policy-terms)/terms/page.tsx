import {
  APP_URL,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next/types";

const title = "Terms of Service | Tech Companies Portugal";
const description =
  "Read the Terms of Service for Tech Companies Portugal — discover tech companies hiring in Portugal, from startups to global tech companies.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    ...defaultOpenGraphMetadata,
    title,
    description,
    url: `${APP_URL}/terms`,
  },
  twitter: {
    ...defaultTwitterMetadata,
    title,
    description,
  },
};

const LAST_UPDATED = "March 2026";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border/60">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Legal
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Terms of Service
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
            ["acceptance", "1. Acceptance of Terms"],
            ["description", "2. Description of Service"],
            ["use", "3. Acceptable Use"],
            ["ip", "4. Intellectual Property"],
            ["privacy", "5. Privacy"],
            ["disclaimers", "6. Disclaimers"],
            ["liability", "7. Limitation of Liability"],
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
        <section id="acceptance" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            1. Acceptance of Terms
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              By accessing or using Tech Companies Portugal (the "Service"), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use the Service.
            </p>
            <p>
              These terms apply to all visitors, users, and others who access
              the Service. We reserve the right to update these terms at any
              time, and continued use of the Service constitutes acceptance of
              any changes.
            </p>
          </div>
        </section>

        <section id="description" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            2. Description of Service
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              Tech Companies Portugal is a free, open directory that aggregates
              publicly available information about tech companies hiring in
              Portugal. The Service is provided for informational purposes only.
            </p>
            <p>
              We do not guarantee the completeness, accuracy, or timeliness of
              any information listed in the directory. Company listings,
              descriptions, and metadata are subject to change without notice.
            </p>
            <p>
              You may optionally create a free account using GitHub or Google
              OAuth to subscribe to weekly email notifications about newly
              listed companies. Account preferences, including notification
              settings and account deletion, are available on your Settings
              page.
            </p>
          </div>
        </section>

        <section id="use" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            3. Acceptable Use
          </h2>
          <div className="flex flex-col gap-3">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>
                Scrape, crawl, or harvest data in a manner that disrupts or
                overloads our infrastructure
              </li>
              <li>
                Use the Service to send unsolicited communications to listed
                companies
              </li>
              <li>
                Misrepresent the source or ownership of data obtained from the
                Service
              </li>
              <li>
                Attempt to gain unauthorised access to any part of the Service
                or its related systems
              </li>
              <li>
                Use the Service for any unlawful purpose or in violation of
                applicable regulations
              </li>
            </ul>
          </div>
        </section>

        <section id="ip" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            4. Intellectual Property
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              The underlying code, design, and editorial curation of the Service
              are the intellectual property of Tech Companies Portugal. The
              source code is open-source and available on GitHub under its
              respective licence.
            </p>
            <p>
              Company names, logos, and trademarks displayed in the directory
              remain the property of their respective owners. Their appearance
              in the directory does not imply any endorsement or affiliation.
            </p>
          </div>
        </section>

        <section id="privacy" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            5. Privacy
          </h2>
          <p>
            Your use of the Service is also governed by our{" "}
            <Link
              href="/policy"
              className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Privacy Policy
            </Link>
            , which is incorporated into these Terms of Service by reference.
            Please review the Privacy Policy to understand our data practices.
          </p>
        </section>

        <section id="disclaimers" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            6. Disclaimers
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              The Service is provided on an "as is" and "as available" basis
              without warranties of any kind, either express or implied,
              including but not limited to warranties of merchantability,
              fitness for a particular purpose, or non-infringement.
            </p>
            <p>
              We do not warrant that the information in the directory is
              accurate, complete, or current. Any reliance you place on such
              information is strictly at your own risk.
            </p>
          </div>
        </section>

        <section id="liability" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            7. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by applicable law, Tech Companies
            Portugal and its contributors shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from
            your use of, or inability to use, the Service — even if advised of
            the possibility of such damages.
          </p>
        </section>

        <section id="governing-law" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            8. Governing Law
          </h2>
          <p>
            These Terms of Service shall be governed by and construed in
            accordance with the laws of Portugal, without regard to its conflict
            of law provisions.
          </p>
        </section>

        <section id="contact" className="scroll-mt-20">
          <h2 className="text-base font-bold text-foreground mb-4">
            9. Contact
          </h2>
          <p>
            If you have questions about these Terms, or if you believe your
            company has been incorrectly listed, please reach out via{" "}
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
            .
          </p>
        </section>
      </div>

      {/* Footer note */}
      <div className="mt-12 pt-8 border-t border-border/60">
        <p className="text-xs text-muted-foreground">
          These terms were last reviewed in {LAST_UPDATED}. Previous versions
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
