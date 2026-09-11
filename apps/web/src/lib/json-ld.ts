import type {
  BreadcrumbList,
  ItemList,
  Organization,
  WebSite,
  WithContext,
} from "schema-dts";
import { APP_URL, DESCRIPTION, SITE_NAME } from "./metadata";
import type { Company } from "./types";

export function safeJsonLdStringify(jsonLd: unknown): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

export function generateJsonLdGraph(
  ...entities: WithContext<WebSite | Organization | ItemList | BreadcrumbList>[]
) {
  return {
    "@context": "https://schema.org",
    "@graph": entities.map((entity) => {
      const { "@context": _, ...rest } = entity as unknown as Record<
        string,
        unknown
      >;
      return rest;
    }),
  };
}

export function generateWebSiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: APP_URL,
    description: DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${APP_URL}/?query={search_term_string}`,
      // @ts-expect-error -- schema.org SearchAction uses query-input
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationJsonLd(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: APP_URL,
    description: DESCRIPTION,
    logo: `${APP_URL}/assets/images/logo.svg`,
  };
}

export function generateCompanyJsonLd(
  company: Company,
): WithContext<Organization> {
  const sameAs = [company.websiteUrl, company.githubUrl].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    url: company.websiteUrl,
    ...(company.logoUrl && { logo: company.logoUrl }),
    location: company.locations
      .filter((location) => location.toLowerCase() !== "remote")
      .map((location) => ({
        "@type": "Place" as const,
        name: location,
        address: {
          "@type": "PostalAddress" as const,
          addressLocality: location,
          addressCountry: "PT",
        },
      })),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function generateItemListJsonLd(
  companies: Company[],
  listName: string,
): WithContext<ItemList> {
  // Only the first 100 entries are listed, but the count must describe the
  // whole list or the markup under-reports the page.
  const items = companies.slice(0, 100);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: companies.length,
    itemListElement: items.map((company, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: company.name,
      url: `${APP_URL}/company/${company.slug}`,
    })),
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[],
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
