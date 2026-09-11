import { AccentHeading } from "@/components/AccentHeading";
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
  locationHeadingParts,
  locationPageDescription,
  locationPageIntro,
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

  const headingParts = locationHeadingParts(location);

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
        <div className="mb-7 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {filteredCompanies.length}{" "}
              {filteredCompanies.length === 1 ? "Company" : "Companies"}
            </span>
          </div>

          <AccentHeading {...headingParts} />

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {locationPageIntro(location)}
          </p>
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
