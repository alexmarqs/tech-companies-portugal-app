import CompaniesList from "@/components/CompaniesList";
import { CompaniesListSkeleton } from "@/components/CompaniesListSkeleton";
import { JsonLdScript } from "@/components/JsonLdScript";
import { NotificationsSideSection } from "@/components/NotificationsSideSection";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  generateBreadcrumbJsonLd,
  generateItemListJsonLd,
  generateJsonLdGraph,
} from "@/lib/json-ld";
import {
  isRemoteLocation,
  locationPageDescription,
  locationPageTitle,
} from "@/lib/locations";
import {
  APP_URL,
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import type { NextParams } from "@/lib/types";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: NextParams<{ location: string }>;
}): Promise<Metadata> {
  const { location: locationParam } = await params;

  const location = decodeURIComponent(locationParam);

  const title = locationPageTitle(location);
  const description = locationPageDescription(location);
  const keywords = `tech companies in ${location}, ${location} software companies, ${location} startups, tech companies portugal`;

  const metadata = {
    ...defaultMetadata,
    title,
    description,
    keywords,
    alternates: {
      canonical: `${APP_URL}/location/${location}`,
    },
    openGraph: {
      ...defaultOpenGraphMetadata,
      title,
      description,
      url: `${APP_URL}/location/${location}`,
    },
    twitter: {
      ...defaultTwitterMetadata,
      title,
      description,
    },
  } satisfies Metadata;

  return metadata;
}

export async function generateStaticParams() {
  const { availableLocations } = await getParsedCompaniesData();

  return availableLocations.map((location) => ({
    location,
  }));
}

export default async function LocationPage({
  params,
}: {
  params: NextParams<{ location: string }>;
}) {
  const { location: locationParam } = await params;

  const location = decodeURIComponent(locationParam);

  const isRemote = isRemoteLocation(location);

  const { companies } = await getParsedCompaniesData();

  const filteredCompanies = companies.filter((company) =>
    company.locations.includes(location),
  );

  const itemListJsonLd = generateItemListJsonLd(
    filteredCompanies,
    locationPageTitle(location),
  );
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: APP_URL },
    {
      name: location,
      url: `${APP_URL}/location/${encodeURIComponent(location)}`,
    },
  ]);

  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-1 px-4 py-3">
      <JsonLdScript
        graph={generateJsonLdGraph(itemListJsonLd, breadcrumbJsonLd)}
      />
      <div className="flex w-full flex-col">
        <PageBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Locations" },
            { label: location },
          ]}
        />
        <div className="relative mb-6 overflow-hidden rounded-3xl border border-primary/15 bg-accent/60 px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute -right-16 -top-16 size-[250px] rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-10 size-[200px] rounded-full bg-orange/10 blur-[80px]" />

          <div className="relative flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-3 py-1 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                {filteredCompanies.length}{" "}
                {filteredCompanies.length === 1 ? "Company" : "Companies"}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl">
              {isRemote
                ? "Remote Tech Companies"
                : `Tech Companies in ${location}`}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isRemote ? (
                <>
                  Explore startups, scaleups, and global tech teams that work
                  remotely from <span className="font-bold">Portugal</span>.
                </>
              ) : (
                <>
                  Explore startups, scaleups, and global tech teams with a
                  presence in <span className="font-bold">{location}</span>.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Suspense fallback={<CompaniesListSkeleton />}>
            <CompaniesList allCompanies={filteredCompanies} isDedicatedPage />
          </Suspense>
          <NotificationsSideSection variant="compact" className="mt-2" />
        </div>
      </div>
    </section>
  );
}
