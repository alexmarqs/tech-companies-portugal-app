import { ManageCompany } from "@/components/my-companies/manage/ManageCompany";
import { getParsedCompaniesCategoriesAndLocations } from "@/lib/parser/companies";
import type { NextParams } from "@/lib/types";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Manage company",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ManageCompanyPage({
  params,
}: {
  params: NextParams<{ slug: string }>;
}) {
  const { slug } = await params;
  const { availableCategories, availableLocations } =
    await getParsedCompaniesCategoriesAndLocations();

  return (
    <ManageCompany
      slug={slug}
      availableCategories={availableCategories}
      availableLocations={availableLocations}
    />
  );
}
