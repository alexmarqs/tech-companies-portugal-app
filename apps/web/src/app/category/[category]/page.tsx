import CompaniesList from "@/components/CompaniesList";
import {
  APP_URL,
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import type { NextParams } from "@/lib/types";
import { normalizeText } from "@/lib/utils";
import type { Metadata } from "next";

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

  const category = decodeURIComponent(categoryParam);

  const normalizedCategory = normalizeText(category);

  const { companies } = await getParsedCompaniesData();

  const filteredCompanies = companies.filter((company) =>
    company.categories.includes(category),
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
              {category}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Discover tech companies in the{" "}
              <span className="font-bold">{normalizedCategory}</span> sector
              across Portugal.
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
