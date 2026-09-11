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
  APP_URL,
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import type { NextParams } from "@/lib/types";
import { decodeCategoryParam, normalizeText } from "@/lib/utils";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: NextParams<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryParam } = await params;

  const category = decodeCategoryParam(categoryParam);

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

  const category = decodeCategoryParam(categoryParam);

  const normalizedCategory = normalizeText(category);

  const { companies } = await getParsedCompaniesData();

  const filteredCompanies = companies.filter((company) =>
    company.categories.includes(category),
  );

  const itemListJsonLd = generateItemListJsonLd(
    filteredCompanies,
    `${category} Companies in Portugal`,
  );
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: APP_URL },
    {
      name: category,
      url: `${APP_URL}/category/${encodeURIComponent(category)}`,
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
            { label: "Categories" },
            { label: category },
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
              {category}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Discover tech companies in the{" "}
              <span className="font-bold">{normalizedCategory}</span> sector
              across Portugal.
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
