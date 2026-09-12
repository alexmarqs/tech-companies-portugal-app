import { getCompaniesOverview } from "@/lib/parser/companies";
import { CompanyShowcase } from "./CompanyShowcase";
import { DirectoryActions } from "./DirectoryActions";

export default async function CompaniesHeader() {
  const { showcaseCompanies, totalCompanies, totalCategories } =
    await getCompaniesOverview();

  return (
    <section
      className="w-full pb-5 pt-10 sm:pb-7 sm:pt-14"
      data-testid="companies-header"
      aria-labelledby="companies-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
          <div className="flex flex-col items-start gap-5 text-left">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <span
                className="size-2 rounded-full bg-success"
                aria-hidden="true"
              />
              Portugal tech directory
            </p>
            <h1
              id="companies-heading"
              className="max-w-3xl text-balance text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[3.25rem] lg:text-[3.55rem]"
            >
              {/* The space is load-bearing: without it the H1's text content
                  reads "techcompanies" to crawlers and screen readers. */}
              <span className="block">Discover tech</span>{" "}
              <span className="block">
                companies in <span className="text-primary">Portugal.</span>
              </span>
            </h1>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              A curated directory of {totalCompanies}+ startups, scaleups, and
              global employers across {totalCategories} categories. Compare what
              they build, where they work, and where your next opportunity could
              be.
            </p>
            <DirectoryActions />
          </div>

          <CompanyShowcase companies={showcaseCompanies} />
        </div>
      </div>
    </section>
  );
}
