import "server-only";

import { companyLogosCache } from "./cache/company-logos-cache";
import { createAdminClient } from "./supabase/server";
import type { Company } from "./types";

const LOGOS_SECRET_KEY = process.env.LOGOS_SERVER_SECRET_KEY;
const LOGOS_PUBLISHABLE_KEY = process.env.LOGOS_PUBLISHABLE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = "company-logos";
const CONCURRENCY = 15;

type LogoDevSearchResult = {
  name: string;
  domain: string;
  logo_url: string;
};

const KNOWN_TWO_PART_TLDS = ["co.uk", "com.pt", "com.br", "co.jp", "com.au"];

function extractDomain(url: string): string | null {
  try {
    let hostname = new URL(url).hostname;
    // Strip www, www2, www3, etc.
    hostname = hostname.replace(/^www\d*\./, "");
    // Extract main domain (skip subdomains like bold.devoteam.com → devoteam.com)
    const parts = hostname.split(".");
    if (parts.length <= 2) return hostname;
    const lastTwo = parts.slice(-2).join(".");
    if (KNOWN_TWO_PART_TLDS.includes(lastTwo)) {
      return parts.slice(-3).join(".");
    }
    return lastTwo;
  } catch {
    return null;
  }
}

async function fetchLogoViaSearch(domain: string): Promise<Buffer | null> {
  const response = await fetch(
    `https://api.logo.dev/search?q=${encodeURIComponent(domain)}`,
    {
      headers: {
        Authorization: `Bearer ${LOGOS_SECRET_KEY}`,
      },
    },
  );

  if (!response.ok) return null;

  const results: LogoDevSearchResult[] = await response.json();
  const firstResult = results[0];
  if (!firstResult?.logo_url) return null;

  const imageResponse = await fetch(firstResult.logo_url);
  if (!imageResponse.ok) return null;

  const arrayBuffer = await imageResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function fetchLogoDirectly(domain: string): Promise<Buffer | null> {
  const imageResponse = await fetch(
    `https://img.logo.dev/${encodeURIComponent(domain)}?token=${LOGOS_PUBLISHABLE_KEY}&format=png`,
  );

  if (!imageResponse.ok) return null;

  const arrayBuffer = await imageResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function fetchLogoFromLogoDev(
  companyWebsiteUrl: string,
): Promise<Buffer | null> {
  if (!LOGOS_SECRET_KEY) return null;

  const domain = extractDomain(companyWebsiteUrl);
  if (!domain) return null;

  return (
    (await fetchLogoViaSearch(domain)) ?? (await fetchLogoDirectly(domain))
  );
}

async function uploadToStorage(
  slug: string,
  imageBuffer: Buffer,
): Promise<string | null> {
  const supabase = await createAdminClient();
  const filePath = `${slug}.png`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageBuffer, {
      contentType: "image/png",
      upsert: true,
      cacheControl: "31536000, immutable", // 1 year, never revalidate (ok as long as we have a version query param)
    });

  if (error) {
    console.error(`Failed to upload logo for ${slug}:`, error.message);
    return null;
  }

  const version = Date.now();
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filePath}?v=${version}`;
}

async function getCompanyLogoUrl(company: Company): Promise<string | null> {
  try {
    const cached = await companyLogosCache.get(company.slug);

    if (cached && cached !== "none") {
      return cached;
    }
  } catch {
    // Redis unavailable, continue without cache
  }

  const imageBuffer = await fetchLogoFromLogoDev(company.websiteUrl);

  if (!imageBuffer) return null;

  const publicUrl = await uploadToStorage(company.slug, imageBuffer);

  if (!publicUrl) return null;

  try {
    await companyLogosCache.set(company.slug, publicUrl);
  } catch {
    // Redis unavailable
  }

  return publicUrl;
}

async function processInBatches<T, R>(
  items: T[],
  fn: (item: T) => Promise<R | null>,
  concurrency: number,
): Promise<(R | null)[]> {
  const results: (R | null)[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    for (const result of batchResults) {
      results.push(result.status === "fulfilled" ? result.value : null);
    }
  }
  return results;
}

export async function hydrateCompaniesWithLogos(
  companies: Company[],
): Promise<Company[]> {
  const logoUrls = await processInBatches(
    companies,
    getCompanyLogoUrl,
    CONCURRENCY,
  );

  return companies.map((company, index) => ({
    ...company,
    logoUrl: logoUrls[index] ?? undefined,
  }));
}
