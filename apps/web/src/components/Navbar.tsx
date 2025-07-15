import { getParsedCompaniesCategoriesAndLocations } from "@/lib/parser/companies";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import logo from "../../public/assets/images/logo.png";
import ExploreButton from "./ExploreButton";
import FiltersPanelButton from "./FiltersPanelButton";
import { Button } from "./ui/button";
import { useAuth } from "./hooks/useAuth";

export default function Navbar() {
  const { user, signOut, loading } = useAuth();

  return (
    <header
      className="bg-background shadow-sm sticky top-0 z-10 py-2 font-mono font-semibold"
      data-testid="navbar"
      role="banner"
    >
      <div className="container mx-auto flex h-full items-center justify-between flex-wrap px-3">
        <Link
          href="/"
          className="flex items-center gap-1 flex-shrink-0"
          aria-label="Tech Companies Portugal - Home"
        >
          <Image
            src={logo}
            priority
            alt="Tech companies in Portugal Logo"
            width="40"
            height="40"
          />
          <div className="hidden sm:block text-sm">
            <span className="font-bold text-green-700" aria-hidden="true">
              {"<"}
            </span>
            <span>TechCompaniesPortugal</span>
            <span className="font-bold text-yellow-400" aria-hidden="true">
              {"/"}
            </span>
            <span className="font-bold text-red-500" aria-hidden="true">
              {">"}
            </span>
          </div>
        </Link>

        <nav
          className="flex items-center gap-2"
          role="navigation"
          aria-label="Main navigation"
        >
          <Suspense fallback={""}>
            <FiltersPanelButton
              companiesCategoriesAndLocationsPromise={getParsedCompaniesCategoriesAndLocations()}
            />
          </Suspense>
          <ExploreButton />
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <Button 
                    variant="secondary" 
                    onClick={() => signOut()}
                    className="text-xs"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild variant="secondary">
                  <Link href="/auth" aria-label="Sign in or Sign up">
                    Sign In
                  </Link>
                </Button>
              )}
            </>
          )}
          <Button asChild>
            <a
              href="https://github.com/alexmarqs/frontend-tech-companies-portugal"
              target="_blank"
              rel="noopener"
              className="!px-2"
              aria-label="View project on GitHub"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                role="img"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
