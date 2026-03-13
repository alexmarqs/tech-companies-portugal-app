import {
  CompanyContent,
  OgLayout,
  PageContent,
  getLogoSrc,
} from "@/lib/og/components";
import { OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og/utils";
import { getParsedCompanyBySlug } from "@/lib/parser/companies";
import { ImageResponse } from "next/og";

export const alt = "Tech Company in Portugal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const DEFAULT_DESCRIPTION =
  "Discover tech companies hiring in Portugal — from startups to global tech companies — all in one place.";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getParsedCompanyBySlug(slug);

  const title = company?.name ?? slug;
  const description = company?.description ?? DEFAULT_DESCRIPTION;
  const companyLogo = company?.logoUrl;

  const allText = [
    title,
    description,
    "TechCompaniesPortugal",
    "techcompaniesportugal.fyi",
    "Tech Company in Portugal",
    "View Profile & Careers",
  ].join("");

  const [fonts, logoSrc] = await Promise.all([
    loadOgFonts(allText),
    getLogoSrc(),
  ]);

  return new ImageResponse(
    <OgLayout logoSrc={logoSrc}>
      {companyLogo ? (
        <CompanyContent
          title={title}
          description={description}
          companyLogo={companyLogo}
        />
      ) : (
        <PageContent title={title} description={description} />
      )}
    </OgLayout>,
    { ...size, emoji: "twemoji", fonts },
  );
}
