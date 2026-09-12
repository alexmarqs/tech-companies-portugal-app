import { AccentHeading } from "@/components/AccentHeading";
import CompaniesList from "@/components/CompaniesList";
import { CompaniesListSkeleton } from "@/components/CompaniesListSkeleton";
import { JsonLdScript } from "@/components/JsonLdScript";
import { NotificationsSideSection } from "@/components/NotificationsSideSection";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  categoryHeadingParts,
  categoryPageDescription,
  categoryPageTitle,
} from "@/lib/categories";
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

  const categoryName = normalizeText(category);

  const title = categoryPageTitle(category);
  const description = categoryPageDescription(category);
  const keywords = `${categoryName} tech companies portugal, ${categoryName} software companies, ${categoryName} startups portugal`;

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

  const headingParts = categoryHeadingParts(category);

  const { companies } = await getParsedCompaniesData();

  const filteredCompanies = companies.filter((company) =>
    company.categories.includes(category),
  );

  const itemListJsonLd = generateItemListJsonLd(
    filteredCompanies,
    categoryPageTitle(category),
  );
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: APP_URL },
    {
      name: normalizedCategory,
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
            { label: normalizedCategory },
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
            Discover tech companies in the {normalizedCategory} sector across
            Portugal.
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
