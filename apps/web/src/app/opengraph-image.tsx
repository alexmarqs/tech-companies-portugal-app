import { HomepageContent, OgLayout, getLogoSrc } from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { ImageResponse } from "next/og";

export const alt = "Tech Companies in Portugal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const DEFAULT_DESCRIPTION =
  "Discover tech companies hiring in Portugal — from startups to global tech companies — all in one place.";

const ALL_TEXT = [
  "Tech Companies in Portugal",
  DEFAULT_DESCRIPTION,
  "TechCompaniesPortugal",
  "techcompaniesportugal.fyi",
  "Find your next tech company in Portugal",
].join("");

export default async function Image() {
  const [fonts, logoSrc] = await Promise.all([
    loadOgFonts(ALL_TEXT),
    getLogoSrc(),
  ]);

  return new ImageResponse(
    <OgLayout logoSrc={logoSrc}>
      <HomepageContent description={DEFAULT_DESCRIPTION} />
    </OgLayout>,
    { ...size, emoji: "twemoji", fonts },
  );
}
