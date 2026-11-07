import { OgLayout, PageContent, getLogoSrc } from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { ImageResponse } from "next/og";

export const alt = "REST API | Tech Companies Portugal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const title = "REST API";
const description = "REST API for the Tech Companies Portugal directory";

const ALL_TEXT = [
  title,
  description,
  "TechCompaniesPortugal",
  "techcompaniesportugal.fyi",
].join("");

export default async function Image() {
  const [fonts, logoSrc] = await Promise.all([
    loadOgFonts(ALL_TEXT),
    getLogoSrc(),
  ]);

  return new ImageResponse(
    <OgLayout logoSrc={logoSrc}>
      <PageContent title={title} description={description} />
    </OgLayout>,
    { ...size, emoji: "twemoji", fonts },
  );
}
