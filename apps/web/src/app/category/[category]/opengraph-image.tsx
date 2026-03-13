import { OgLayout, PageContent } from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { normalizeText } from "@/lib/utils";
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

  const title = `${category} Companies`;
  const description = `Discover tech companies in the ${normalizeText(category)} sector. Find job opportunities and connect with tech companies in Portugal.`;

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
