import { APP_URL } from "@/lib/metadata";
import { getParsedCompaniesData } from "@/lib/parser/companies";

export const dynamic = "force-static";
// by default now the GET routes are dynamic, but we can force them to be static
// then the fetch revalidate option will force the ISR

export async function GET() {
  const { companies, availableCategories, availableLocations } =
    await getParsedCompaniesData();

  const companiesData = companies.map((company) => {
    return {
      name: company.name,
      description: `${company.name} - explore company details, careers and social links.`,
      url: `${APP_URL}/company/${company.slug}`,
    };
  });

  const categoriesData = availableCategories.map((category) => {
    return {
      name: category,
      description: `Explore tech companies specialized in ${category}.`,
      url: `${APP_URL}/category/${category}`,
    };
  });

  const locationsData = availableLocations.map((location) => {
    return {
      name: location,
      description: `Discover tech companies in ${location}.`,
      url: `${APP_URL}/location/${location}`,
    };
  });

  const llmsTxt = `# TechCompaniesPortugal

> TechCompaniesPortugal is a comprehensive directory for technology companies based in Portugal.

## Key Features
- Discover tech companies in Portugal by name, description, location, or category.
- Sign up to get access to advanced features such as notifications and personalized settings.
- Promote or feature your company within the directory.

## Home Directory Page
- [Home Page](${APP_URL}): Browse all companies and use search or filters to find specific profiles.

## Company Profile Pages
${companiesData.map((url) => `- [${url.name}](${url.url}): ${url.description}`).join("\n")}

## Location Pages
${locationsData.map((url) => `- [${url.name}](${url.url}): ${url.description}`).join("\n")}

## Category Pages
${categoriesData.map((url) => `- [${url.name}](${url.url}): ${url.description}`).join("\n")}

## Resources
- [Web App GitHub Repository](https://github.com/alexmarqs/frontend-tech-companies-portugal): The github repository for the web app.
- [Data GitHub Repository](https://github.com/marmelo/tech-companies-in-portugal): The github repository where the source data comes from.

## About Author
- [Alexandre Marques](https://alexandremarques.io): Creator of TechCompaniesPortugal, a project dedicated to highlighting the Portuguese technology ecosystem.`;

  return new Response(llmsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
