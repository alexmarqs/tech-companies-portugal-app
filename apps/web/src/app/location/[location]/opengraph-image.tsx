import { OgLayout, PageContent } from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { ImageResponse } from "next/og";

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

  const title = `Companies in ${location} | Tech Companies Portugal`;
  const description = `Discover tech companies based in ${location} - Portugal. Find job opportunities and connect with tech companies in ${location} - Portugal.`;

  const allText = [
    title,
    description,
    "TechCompaniesPortugal",
    "techcompaniesportugal.fyi",
  ].join("");

  const fonts = await loadOgFonts(allText);

  return new ImageResponse(
    <OgLayout>
      <PageContent title={title} description={description} />
    </OgLayout>,
    { ...size, emoji: "twemoji", fonts },
  );
}
