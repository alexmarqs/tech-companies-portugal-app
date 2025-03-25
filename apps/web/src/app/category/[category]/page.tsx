import { Breadcrumb } from "@/components/Breadcrumb";
import CompaniesList from "@/components/CompaniesList";
import { CompaniesListSkeleton } from "@/components/CompaniesListSkeleton";
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
  params: NextParams<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryParam } = await params;

  const category = decodeURIComponent(categoryParam);

  const title = `${category} Companies | Tech Companies Portugal`;
  const description = `Discover tech companies in the ${category} sector. Find job opportunities and connect with ${category} tech companies in Portugal.`;
  const keywords = `${category} tech companies, ${category} software companies, IT employers ${category}, technology sector ${category}`;

  const metadata = {
    ...defaultMetadata,
    title,
    description,
    keywords,
    alternates: {
      canonical: `${APP_URL}/category/${category}`,
    },
    openGraph: {
      ...defaultOpenGraphMetadata,
      title,
      description,
      url: `${APP_URL}/category/${category}`,
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
  const { availableCategories } = await getParsedCompaniesData();

  return availableCategories.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: NextParams<{ category: string }>;
}) {
  const { category: categoryParam } = await params;

  const category = decodeURIComponent(categoryParam);

  const { companies, updatedAtISODate } = await getParsedCompaniesData();

  const filteredCompanies = companies.filter((company) =>
    company.categories.includes(category),
  );

  return (
    <section className="mx-auto flex w-full max-w-5xl p-3 relative flex-1">
      <div className="flex flex-col gap-5 w-full">
        <Breadcrumb
          items={[
            { label: "Category", className: "text-muted-foreground" },
            { label: category },
          ]}
        />
        <h1 className="text-2xl font-bold">{category} Companies</h1>
        <Suspense fallback={<CompaniesListSkeleton />}>
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
