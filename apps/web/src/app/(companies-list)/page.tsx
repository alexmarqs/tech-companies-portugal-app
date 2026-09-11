import CompaniesList from "@/components/CompaniesList";
import { FilterBar } from "@/components/FilterBar";
import { JsonLdScript } from "@/components/JsonLdScript";
import { NotificationsSideSection } from "@/components/NotificationsSideSection";
import {
  generateJsonLdGraph,
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from "@/lib/json-ld";
import { getParsedCompaniesData } from "@/lib/parser/companies";

export default async function CompaniesPage() {
  const { availableCategories, availableLocations, companies } =
    await getParsedCompaniesData();

  const webSiteJsonLd = generateWebSiteJsonLd();
  const organizationJsonLd = generateOrganizationJsonLd();
  const jsonLdGraph = generateJsonLdGraph(webSiteJsonLd, organizationJsonLd);

  return (
    <section
      id="directory"
      className="relative flex flex-1 scroll-mt-24 flex-col"
    >
      <JsonLdScript graph={jsonLdGraph} />
      <FilterBar
        categoryOptions={availableCategories}
        locationOptions={availableLocations}
      />
      <CompaniesList allCompanies={companies} />
      <NotificationsSideSection className="mt-10" />
    </section>
  );
}
