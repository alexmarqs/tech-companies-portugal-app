import { Breadcrumb } from "@/components/Breadcrumb";
import CompaniesList from "@/components/CompaniesList";
import { getParsedCompaniesData } from "@/lib/parser/companies";
import { NextParams } from "@/lib/types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: NextParams<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryParam } = await params;

  const category = decodeURIComponent(categoryParam);

  return {
    title: `${category} Companies | Tech Companies Portugal`,
    description: `Discover tech companies in the ${category} category. Find job opportunities and connect with ${category} tech companies in Portugal.`,
  };
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
      <div className="flex flex-col gap-4 w-full">
        <Breadcrumb
          items={[{ label: "Category", href: "/" }, { label: category }]}
        />
        <h1 className="text-2xl font-bold">{category} Companies</h1>
        <CompaniesList
          allCompanies={filteredCompanies}
          updatedAtISODate={updatedAtISODate}
        />
      </div>
    </section>
  );
}
