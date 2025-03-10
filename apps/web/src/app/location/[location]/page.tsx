import { Breadcrumb } from "@/components/Breadcrumb";
import CompaniesList from "@/components/CompaniesList";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import { NextParams } from "@/lib/types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: NextParams<{ location: string }>;
}): Promise<Metadata> {
  const { location: locationParam } = await params;

  const location = decodeURIComponent(locationParam);

  return {
    title: `Companies in ${location} | Tech Companies Portugal`,
    description: `Discover tech companies based in ${location}. Find job opportunities and connect with tech companies in ${location}.`,
  };
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
      <div className="flex flex-col gap-4 w-full">
        <Breadcrumb
          items={[{ label: "Location", href: "/" }, { label: location }]}
        />
        <h1 className="text-2xl font-bold">Companies in {location}</h1>
        <CompaniesList
          allCompanies={filteredCompanies}
          updatedAtISODate={updatedAtISODate}
        />
      </div>
    </section>
  );
}
