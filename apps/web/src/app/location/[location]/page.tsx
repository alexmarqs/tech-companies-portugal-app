import { Breadcrumb } from "@/components/Breadcrumb";
import CompaniesList from "@/components/CompaniesList";
import {
  APP_URL,
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import { NextParams } from "@/lib/types";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: NextParams<{ location: string }>;
}): Promise<Metadata> {
  const { location: locationParam } = await params;

  const location = decodeURIComponent(locationParam);

  const title = `Companies in ${location} | Tech Companies Portugal`;
  const description = `Discover tech companies based in ${location} - Portugal. Find job opportunities and connect with tech companies in ${location} - Portugal.`;
  const keywords = `tech companies in ${location}, Portugal tech jobs, ${location} software companies, IT employers ${location}`;

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
      images: [`api/og?title=${title}&description=${description}`],
    },
    twitter: {
      ...defaultTwitterMetadata,
      title,
      description,
      images: [`api/og?title=${title}&description=${description}`],
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

  const { companies, updatedAtISODate } = await getParsedCompaniesData();

  const filteredCompanies = companies.filter((company) =>
    company.locations.includes(location),
  );

  return (
    <section className="mx-auto flex w-full max-w-5xl p-3 relative">
      <div className="flex flex-col gap-5 w-full">
        <Breadcrumb
          items={[
            { label: "Location", className: "text-muted-foreground" },
            { label: location },
          ]}
        />
        <h1 className="text-2xl font-bold">Companies in {location}</h1>

        <Suspense>
          <CompaniesList
            allCompanies={filteredCompanies}
            updatedAtISODate={updatedAtISODate}
            allowSearchParams={false}
          />
        </Suspense>
      </div>
    </section>
  );
}
