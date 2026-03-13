import { OgLayout, PageContent, getLogoSrc } from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { normalizeText } from "@/lib/utils";
import { ImageResponse } from "next/og";

// force generation on demand for paths not known at build time
// this is the default anyway
export const dynamicParams = true;

export async function generateStaticParams() {
  // this is to force generation on demand for paths not known at build time
  return [];
}

export const alt = "Tech Companies Portugal - Category";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryParam } = await params;
  const category = decodeURIComponent(categoryParam);

  const title = `${category} Companies`;
  const description = `Discover tech companies in the ${normalizeText(category)} sector. Find job opportunities and connect with tech companies in Portugal.`;

  const allText = [
    title,
    description,
    "TechCompaniesPortugal",
    "techcompaniesportugal.fyi",
  ].join("");

  const [fonts, logoSrc] = await Promise.all([
    loadOgFonts(allText),
    getLogoSrc(),
  ]);

  return new ImageResponse(
    <OgLayout logoSrc={logoSrc}>
      <PageContent title={title} description={description} />
    </OgLayout>,
    { ...size, emoji: "twemoji", fonts },
  );
}
