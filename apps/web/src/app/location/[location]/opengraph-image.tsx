import { OgLayout, PageContent, getLogoSrc } from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { ImageResponse } from "next/og";

// force generation on demand for paths not known at build time
// this is the default anyway
export const dynamicParams = true;

export async function generateStaticParams() {
  // this is to force generation on demand for paths not known at build time
  return [];
}

export const alt = "Tech Companies Portugal - Location";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location: locationParam } = await params;
  const location = decodeURIComponent(locationParam);

  const title = `Companies in ${location}`;
  const description = `Discover tech companies based in ${location} - Portugal. Find job opportunities and connect with tech companies in ${location} - Portugal.`;

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
