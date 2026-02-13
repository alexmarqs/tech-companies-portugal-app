import CompaniesList from "@/components/CompaniesList";
import { SearchSideBar } from "@/components/SearchSideBar";
import { SideBar } from "@/components/SideBar";
import { getParsedCompaniesData } from "@/lib/parser/companies";

export default async function CompaniesPage() {
  const { availableCategories, availableLocations, companies } =
    await getParsedCompaniesData();

  return (
    <section className="relative flex flex-1 flex-col gap-6 lg:flex-row">
      <SideBar
        categoryOptions={availableCategories}
        locationOptions={availableLocations}
      />

      <div className="block lg:hidden">
        <SearchSideBar
          locationOptions={availableLocations}
          categoryOptions={availableCategories}
        />
      </div>
      <CompaniesList allCompanies={companies} />
    </section>
  );
}
