import { getParsedCompaniesData } from "@/lib/parser/companies";
import Image from "next/image";
import logo from "../../public/assets/images/logo.png";

export default async function Footer() {
  const { availableLocations, availableCategories } =
    await getParsedCompaniesData();

  return (
    <footer className="bg-background font-mono">
      <div className="container flex flex-col gap-4 p-6">
        <div className="w-full flex flex-col md:flex-row md:justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <Image
              src={logo}
              alt="Tech Companies Portugal Logo"
              width={35}
              height={35}
            />
            <span className="text-xs font-semibold">
              techcompaniesportugal.fyi
            </span>
          </div>
          <p className="text-xs text-center">
            Crafted by{" "}
            <a
              href="https://alexandremarques.io"
              target="_blank"
              rel="noopener"
              className="underline underline-offset-[2px]"
            >
              Alexandre Marques
            </a>{" "}
            <span>&copy; {new Date().getFullYear()}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 border-t border-border pt-6">
          <div className="flex flex-col gap-5">
            <h3
              aria-label="Companies by Location"
              className="text-sm font-semibold"
            >
              Companies by Location
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {availableLocations.map((location) => (
                <a
                  key={location}
                  target="_blank"
                  aria-label={`Companies in ${location}`}
                  href={`/location/${encodeURIComponent(location)}`}
                  className="text-xs hover:underline"
                >
                  {location}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h3
              aria-label="Companies by Category"
              className="text-sm font-semibold"
            >
              Companies by Category
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((category) => (
                <a
                  key={category}
                  target="_blank"
                  aria-label={`${category} companies`}
                  href={`/category/${encodeURIComponent(category)}`}
                  className="text-xs hover:underline"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
