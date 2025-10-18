import { getParsedCompaniesData } from "@/lib/parser/companies";
import { HotFeaturedBadge } from "./HotFeaturedBadge";
import { LogoFooter } from "./LogoFooter";

export default async function Footer() {
  const { availableLocations, availableCategories } =
    await getParsedCompaniesData();

  return (
    <footer className="bg-background font-mono">
      <div className="container flex flex-col gap-4 p-6">
        <div className="w-full flex flex-col md:flex-row md:justify-between items-center flex-wrap gap-4">
          <LogoFooter />
          <p className="text-xs text-center">
            Built by{" "}
            <a
              href="https://alexandremarques.io"
              target="_blank"
              rel="noreferrer noopener author"
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
                  rel="noreferrer"
                >
                  {getCompanyLocationLabel(location)}
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
                  rel="noreferrer"
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

const getCompanyLocationLabel = (location: string) => {
  if (location.toLowerCase() === "remote") {
    return (
      <div className="inline-flex gap-2">
        <span>{location}</span>
        <HotFeaturedBadge className="text-[9px]" />
      </div>
    );
  }
  return location;
};
