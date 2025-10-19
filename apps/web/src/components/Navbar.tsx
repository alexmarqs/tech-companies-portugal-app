import { getParsedCompaniesCategoriesAndLocations } from "@/lib/parser/companies";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import logo from "../../public/assets/images/logo.png";
import ExploreButton from "./ExploreButton";
import FiltersPanelButton from "./FiltersPanelButton";

import { ContactButton } from "./ContactButton";
import { UserMenu } from "./UserMenu";

export default function Navbar() {
  return (
    <header
      className="bg-background shadow-sm sticky top-0 z-10 py-2 font-mono font-semibold"
      data-testid="navbar"
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

        <nav className="flex items-center gap-3" aria-label="Main navigation">
          <Suspense fallback={""}>
            <FiltersPanelButton
              companiesCategoriesAndLocationsPromise={getParsedCompaniesCategoriesAndLocations()}
            />
          </Suspense>
          <ExploreButton />
          <ContactButton />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
