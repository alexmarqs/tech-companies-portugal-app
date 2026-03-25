import CompaniesList from "@/components/CompaniesList";
import { MobileSearchDrawer } from "@/components/MobileSearchDrawer";
import { SideBar } from "@/components/SideBar";
import {
  generateJsonLdGraph,
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
  safeJsonLdStringify,
} from "@/lib/json-ld";
import { getParsedCompaniesData } from "@/lib/parser/companies";

export default async function CompaniesPage() {
  const { availableCategories, availableLocations, companies } =
    await getParsedCompaniesData();

  const webSiteJsonLd = generateWebSiteJsonLd();
  const organizationJsonLd = generateOrganizationJsonLd();
  const jsonLdGraph = generateJsonLdGraph(webSiteJsonLd, organizationJsonLd);

  return (
    <section className="relative flex flex-1 flex-col gap-6 lg:flex-row">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(jsonLdGraph),
        }}
      />
      <SideBar
        categoryOptions={availableCategories}
        locationOptions={availableLocations}
      />

      <div className="lg:hidden">
        <MobileSearchDrawer
          locationOptions={availableLocations}
          categoryOptions={availableCategories}
        />
      </div>
      <CompaniesList allCompanies={companies} />
    </section>
  );
}
