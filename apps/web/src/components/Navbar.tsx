import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/images/logo.png";

import { ContactButton } from "./ContactButton";
import { UserMenu } from "./UserMenu";

export default function Navbar() {
  return (
    <header
      className="bg-card/80 backdrop-blur-xl border-b border-border/40 sticky top-0 z-50 py-2.5"
      data-testid="navbar"
    >
      <div className="container mx-auto flex h-full items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Tech Companies Portugal - Home"
        >
          <Image
            src={logo}
            priority
            alt="Tech companies in Portugal Logo"
            width="32"
            height="32"
            className="mt-0.5"
          />

          <span className="hidden sm:inline-block logo-stroke">
            <span className="text-sm font-bold tracking-tight text-foreground">
              TechCompanies
            </span>
            <span className="text-sm font-bold tracking-tight text-foreground">
              Portugal
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-3" aria-label="Main navigation">
          <ContactButton />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
