import { getParsedCompaniesData } from "@/lib/parser/companies";
import { MapPin, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/images/logo.png";
import { Credits } from "./Credits";
import { SocialIcons } from "./SocialIcons";

export default async function Footer() {
  const { availableLocations, availableCategories } =
    await getParsedCompaniesData();

  return (
    <footer className="bg-card border-t border-border/60">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Tech Companies Portugal Logo"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="inline-block logo-stroke">
                <span className="text-sm font-bold tracking-tight">
                  TechCompanies
                </span>
                <span className="text-sm font-bold tracking-tight">
                  Portugal
                </span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Helping you discover the best tech companies, startups, and
              scale-ups in Portugal.
            </p>
          </div>

          {/* Platform links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Platform
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Resources links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Resources
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/privacy"
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
        <div className="border-t border-border/60 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
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
                    "text-xs px-3 py-1.5 rounded-full bg-muted/60 text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors"
                  }
                >
                  {location}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Companies by Category
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <a
                  key={category}
                  href={`/category/${encodeURIComponent(category)}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted/60 text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 py-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 flex-wrap">
          <Credits />
          <div className="flex items-center gap-4">
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
