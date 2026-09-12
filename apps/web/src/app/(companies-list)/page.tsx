import CompaniesList from "@/components/CompaniesList";
import { FilterBar } from "@/components/FilterBar";
import { JsonLdScript } from "@/components/JsonLdScript";
import { NotificationsSideSection } from "@/components/NotificationsSideSection";
import { TopCitiesBrowse } from "@/components/TopCitiesBrowse";
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
    <section className="relative flex flex-1 flex-col">
      <JsonLdScript graph={jsonLdGraph} />
      <TopCitiesBrowse companies={companies} className="mb-9" />
      <div id="directory" className="scroll-mt-24">
        <FilterBar
          categoryOptions={availableCategories}
          locationOptions={availableLocations}
        />
        <CompaniesList allCompanies={companies} />
      </div>
      <NotificationsSideSection className="mt-10" />
    </section>
  );
}
