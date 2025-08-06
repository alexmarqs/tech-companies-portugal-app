import { load as cheerioLoad } from "cheerio";
import slugify from "slugify";
import { featuredSlugCompanies } from "./featured";
import type { Company } from "./types";

export const parseCompaniesData = async () => {
  try {
    // fetching the html from the github api
    const { html: htmlData, date } = await fetchGithubReadmeHtmlFrom(
      "marmelo",
      "tech-companies-in-portugal",
    );

    // extracting the data from the html to a list of companies json
    const data = extractCompaniesDataFromHtml(htmlData);

    return {
      data,
      timestamp: date ? new Date(date).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error parsing companies data", error);
    throw error;
  }
};

const fetchGithubReadmeHtmlFrom = async (owner: string, repo: string) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;

  const response = await fetch(url, {
    headers: {
      UserAgent: "Tech Companies in Portugal",
      Accept: "application/vnd.github.html+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "force-cache",
    next: {
      revalidate: 21600, // 6 hours
      tags: ["companies-data"],
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.statusText}`);
  }

  const html = await response.text();

  return {
    html,
    date: response.headers.get("date"),
  };
};

const extractCompaniesDataFromHtml = (html: string) => {
  const $ = cheerioLoad(html);

  const companies: Company[] = [];
  const availableCategories = new Set<string>();
  const availableLocations = new Set<string>();

  $("h2.heading-element").each((_, element) => {
    const category = $(element).text().trim();
    const nextSibling = $(element).parent().next();

    if (
      nextSibling.is("markdown-accessiblity-table") &&
      nextSibling.find("table").length
    ) {
      availableCategories.add(category);

      nextSibling.find("table tr").each((index, row) => {
        if (index === 0) return;

        const columns = $(row).find("td");
        const links = $(columns[0]).find("a");
        const name = links.first().text();
        const locations = $(columns[2])
          .find("code")
          .map((_, code) => {
            // sanitize the location
            return sanitizeLocation($(code).text());
          })
          .get();

        for (const location of locations) {
          availableLocations.add(location);
        }

        const slug = slugify(name, { lower: true, strict: true });

        const company: Company = {
          slug: slug,
          name: name,
          websiteUrl: links.first().attr("href") || "",
          careersUrl: "",
          githubUrl: "",
          description: $(columns[1]).text(),
          locations: locations,
          categories: category,
          isFeatured: featuredSlugCompanies.includes(slug),
        };

        links.each((_, link) => {
          const href = $(link).attr("href");
          const linkText = $(link).text();

          if (linkText === "🚀") {
            company.careersUrl = href || "";
          } else if (linkText === "") {
            company.githubUrl = href || "";
          }
        });

        companies.push(company);
      });
    }
  });

  if (companies.length === 0) {
    throw new Error("No companies data found");
  }

  return {
    companies,
    availableCategories: Array.from(availableCategories),
    availableLocations: Array.from(availableLocations),
  };
};

// In some cases we have the same location with different names
const sanitizeLocation = (location: string) => {
  return locationSanitizerMap[location] || location;
};

const locationSanitizerMap: Record<string, string> = {
  Lisbon: "Lisboa",
  remote: "Remote",
};
