import CompaniesList from "@/components/CompaniesList";
import {
  APP_URL,
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import type { NextParams } from "@/lib/types";
import type { Metadata } from "next";

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

  const { companies } = await getParsedCompaniesData();

  const filteredCompanies = companies.filter((company) =>
    company.locations.includes(location),
  );

  return (
    <section className="mx-auto flex w-full max-w-5xl p-3 relative flex-1">
      <div className="flex flex-col w-full">
        <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-emerald-50/80 via-background to-amber-50/40 border border-border/40 px-6 py-8 sm:px-8 sm:py-10 mb-6">
          <div className="absolute -top-16 -right-16 w-[250px] h-[250px] bg-emerald-300/15 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-10 w-[200px] h-[200px] bg-red-300/10 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-border/60 backdrop-blur-sm w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                {filteredCompanies.length}{" "}
                {filteredCompanies.length === 1 ? "Company" : "Companies"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1]">
              {location}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Discover tech companies based in{" "}
              <span className="font-bold">{location}</span> across Portugal.
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4">
          <CompaniesList allCompanies={filteredCompanies} isDedicatedPage />
        </div>
      </div>
    </section>
  );
}
