import { OgLayout, PageContent } from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { ImageResponse } from "next/og";

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

  const title = `${category} Companies | Tech Companies Portugal`;
  const description = `Discover tech companies in the ${category} sector. Find job opportunities and connect with ${category} tech companies in Portugal.`;

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
