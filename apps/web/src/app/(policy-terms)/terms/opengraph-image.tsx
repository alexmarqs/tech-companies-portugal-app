import { OgLayout, PageContent, getLogoSrc } from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { ImageResponse } from "next/og";

export const alt = "Terms of Service | Tech Companies Portugal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const title = "Terms of Service";
const description =
  "Read the Terms of Service for Tech Companies Portugal — discover tech companies hiring in Portugal, from startups to global tech companies.";

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
