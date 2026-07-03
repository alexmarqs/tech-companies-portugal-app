import { Title } from "@/components/Title";
import { SubmitCompanyForm } from "@/components/submit/SubmitCompanyForm";
import { getParsedCompaniesCategoriesAndLocations } from "@/lib/parser/companies";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Submit a company",
  description:
    "Submit a tech company in Portugal to be reviewed and added to the directory.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SubmitCompanyPage() {
  const { availableCategories, availableLocations } =
    await getParsedCompaniesCategoriesAndLocations();

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <Title
          title="Submit a company"
          description="Know or work at a tech company in Portugal that's missing? Submit it for review, we will let you know when it's live."
        />
      </div>
      <SubmitCompanyForm
        availableCategories={availableCategories}
        availableLocations={availableLocations}
      />
    </div>
  );
}
