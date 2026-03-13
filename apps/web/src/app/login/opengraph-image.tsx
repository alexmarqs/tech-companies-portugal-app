import { OgLayout, PageContent } from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { ImageResponse } from "next/og";

export const alt = "Sign in | Tech Companies Portugal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const title = "Sign in | Tech Companies Portugal";
const description =
  "Sign in to get weekly updates on new tech companies in Portugal. Access company profiles and manage your preferences.";

const ALL_TEXT = [
  title,
  description,
  "TechCompaniesPortugal",
  "techcompaniesportugal.fyi",
].join("");

export default async function Image() {
  const fonts = await loadOgFonts(ALL_TEXT);

  return new ImageResponse(
    <OgLayout>
      <PageContent title={title} description={description} />
    </OgLayout>,
    { ...size, emoji: "twemoji", fonts },
  );
}
