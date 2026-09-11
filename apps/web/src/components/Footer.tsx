import { getParsedCompaniesData } from "@/lib/parser/companies";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/utils";
import { MapPin, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Credits } from "./Credits";
import { SocialIcons } from "./SocialIcons";

export default async function Footer() {
  const { availableLocations, availableCategories } =
    await getParsedCompaniesData();

  return (
    <footer className="border-t border-border/70 bg-card/65">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/logo.svg"
                alt="Tech Companies Portugal Logo"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="text-sm font-bold tracking-[-0.03em]">
                Tech Companies <span className="text-primary">Portugal</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A curated directory of startups, scaleups, and global tech
              employers across Portugal.
            </p>
          </div>

          {/* Platform links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Platform
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/about"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/llms.txt"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                LLMs.txt
              </Link>
              <a
                href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
                className="text-sm text-foreground/80 transition-colors hover:text-primary"
              >
                List your company
              </a>
            </nav>
          </div>

          {/* Resources links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Resources
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/policy"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Social
            </h3>
            <nav className="flex items-center gap-3">
              <a
                href="https://github.com/alexmarqs"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all"
              >
                <SocialIcons icon="github" className="size-5" />
              </a>
              <a
                href="https://x.com/alexlmarques"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all"
              >
                <SocialIcons icon="x" className="size-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/alexandre-marques-ba87a877"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all"
              >
                <SocialIcons icon="linkedin" className="size-5" />
              </a>
            </nav>
          </div>
        </div>

        {/* Directory links */}
        <div className="grid grid-cols-1 gap-8 border-t border-border/60 py-8 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Companies by Location
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableLocations.map((location) => (
                <a
                  key={location}
                  href={`/location/${encodeURIComponent(location)}`}
                  className={
                    "rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:border-primary/20 hover:bg-accent hover:text-primary"
                  }
                >
                  {location}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Tag className="size-3.5 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Companies by Category
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <a
                  key={category}
                  href={`/category/${encodeURIComponent(category)}`}
                  className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:border-primary/20 hover:bg-accent hover:text-primary"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 py-5">
          <Credits />
          <div className="flex justify-center items-center gap-4">
            <a
              href="https://techcompaniesportugal.openstatus.dev"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="h-5"
                src="https://techcompaniesportugal.openstatus.dev/badge"
                alt="OpenStatus Badge"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
