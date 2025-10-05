import CompaniesList from "@/components/CompaniesList";
import { SideBar } from "@/components/SideBar";
import { getParsedCompaniesData } from "@/lib/parser/companies";

export default async function CompaniesPage() {
  const {
    availableCategories,
    availableLocations,
    companies,
    updatedAtISODate,
  } = await getParsedCompaniesData();

  return (
    <section className="relative flex flex-1 flex-col gap-6 md:flex-row">
      <SideBar
        categoryOptions={availableCategories}
        locationOptions={availableLocations}
      />

      <CompaniesList allCompanies={companies} />
    </section>
  );
}
