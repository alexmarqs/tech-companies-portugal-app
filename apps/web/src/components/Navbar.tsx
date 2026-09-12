import Image from "next/image";
import Link from "next/link";
import { InstallPWAButton } from "./InstallPWAButton";
import { UserMenu } from "./UserMenu";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl"
      data-testid="navbar"
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="Tech Companies Portugal - Home"
        >
          <Image
            src="/assets/images/logo-junction-navbar.svg"
            priority
            alt="Tech companies in Portugal Logo"
            width="30"
            height="30"
          />

          <span className="hidden flex-col text-[14px] font-bold leading-[0.95] tracking-[-0.035em] text-foreground sm:flex">
            <span>Tech Companies</span>
            <span className="text-primary">Portugal</span>
          </span>
        </Link>

        <nav
          className="flex items-center gap-1 sm:gap-2"
          aria-label="Main navigation"
        >
          <Link
            href="/#directory"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            Companies
          </Link>
          <Link
            href="/about"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            About
          </Link>

          <InstallPWAButton />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
