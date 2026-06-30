import CompaniesList from "@/components/CompaniesList";
import { FilterBar } from "@/components/FilterBar";
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
    <section className="relative flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(jsonLdGraph),
        }}
      />
      <FilterBar
        categoryOptions={availableCategories}
        locationOptions={availableLocations}
      />
      <CompaniesList allCompanies={companies} />
    </section>
  );
}
