import { APP_URL } from "@/lib/metadata";
import { SettingsTab } from "@/lib/search-params";
import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Footer } from "../components/footer";
import { Logo } from "../components/logo";

interface WeeklyNewCompaniesEmailProps {
  newCompanies: {
    slug: string;
    name: string;
  }[];
}

const MAX_NEW_COMPANIES_TO_SHOW = 12;

const PREVIEW_COMPANIES = [
  { slug: "coverflex", name: "Coverflex" },
  { slug: "unbabel", name: "Unbabel" },
  { slug: "remote", name: "Remote" },
  { slug: "feedzai", name: "Feedzai" },
];

export default function WeeklyNewCompaniesEmail({
  newCompanies = PREVIEW_COMPANIES,
}: WeeklyNewCompaniesEmailProps) {
  const companyCount = newCompanies.length;
  const visibleCompanies = newCompanies.slice(0, MAX_NEW_COMPANIES_TO_SHOW);
  const remainingCount = Math.max(companyCount - MAX_NEW_COMPANIES_TO_SHOW, 0);
  const companyLabel = companyCount === 1 ? "company" : "companies";
  const previewText = `${companyCount} new ${companyLabel} landed in the Portugal tech directory`;

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Geist"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: "#f5f0e9",
          color: "#2d2825",
          fontFamily: "Geist, Helvetica, Arial, sans-serif",
          margin: 0,
          padding: "24px 12px",
        }}
      >
        <Container style={{ margin: "0 auto", maxWidth: "600px" }}>
          <Section
            style={{
              backgroundColor: "#fffdf9",
              border: "1px solid #e6dbd1",
              borderRadius: "22px",
              overflow: "hidden",
            }}
          >
            <Section style={{ backgroundColor: "#3f8051", height: "7px" }} />

            <Section style={{ padding: "30px 28px 24px" }}>
              <Logo />

              <Text
                style={{
                  color: "#3f8051",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1.8px",
                  margin: "28px 0 10px",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                Weekly field note · Portugal
              </Text>
              <Heading
                style={{
                  color: "#2d2825",
                  fontSize: "32px",
                  fontWeight: 700,
                  letterSpacing: "-1.2px",
                  lineHeight: "36px",
                  margin: "0 auto 12px",
                  maxWidth: "460px",
                  textAlign: "center",
                }}
              >
                {companyCount} new {companyLabel} on the map
              </Heading>
              <Text
                style={{
                  color: "#766b64",
                  fontSize: "15px",
                  lineHeight: "23px",
                  margin: "0 auto",
                  maxWidth: "430px",
                  textAlign: "center",
                }}
              >
                Fresh additions to the directory, ready for you to explore.
              </Text>
            </Section>

            <Section
              style={{
                backgroundColor: "#fff3ed",
                borderTop: "1px dashed #debfb1",
                borderBottom: "1px dashed #debfb1",
                padding: "8px 28px 22px",
              }}
            >
              <Text
                style={{
                  color: "#9a5a49",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  margin: "14px 0 8px",
                  textTransform: "uppercase",
                }}
              >
                New arrivals · Issue {new Date().getFullYear()}
              </Text>

              {visibleCompanies.map((company, index) => (
                <Section key={company.slug}>
                  <Link
                    href={`${APP_URL}/company/${company.slug}`}
                    style={{
                      color: "#2d2825",
                      display: "block",
                      fontSize: "15px",
                      fontWeight: 600,
                      lineHeight: "22px",
                      padding: "10px 0",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        color: "#d85f4a",
                        display: "inline-block",
                        fontSize: "11px",
                        letterSpacing: "0.6px",
                        width: "30px",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {company.name}
                    <span style={{ color: "#d85f4a", float: "right" }}>↗</span>
                  </Link>
                  {index < visibleCompanies.length - 1 && (
                    <Hr
                      style={{
                        borderColor: "#ead8ce",
                        borderTop: 0,
                        margin: 0,
                      }}
                    />
                  )}
                </Section>
              ))}

              {remainingCount > 0 && (
                <Text
                  style={{
                    color: "#766b64",
                    fontSize: "13px",
                    lineHeight: "20px",
                    margin: "14px 0 0",
                    textAlign: "center",
                  }}
                >
                  Plus {remainingCount} more waiting in the directory.
                </Text>
              )}
            </Section>

            <Section style={{ padding: "26px 28px 30px", textAlign: "center" }}>
              <Button
                href={APP_URL}
                style={{
                  backgroundColor: "#d85f4a",
                  borderRadius: "10px",
                  color: "#ffffff",
                  display: "inline-block",
                  fontSize: "14px",
                  fontWeight: 700,
                  padding: "13px 24px",
                  textDecoration: "none",
                }}
              >
                Explore the directory
              </Button>
              <Text
                style={{
                  color: "#9a8e86",
                  fontSize: "11px",
                  lineHeight: "17px",
                  margin: "16px 0 0",
                }}
              >
                Curated from the Portuguese tech community.
              </Text>
            </Section>
          </Section>

          <Footer>
            <span style={{ fontSize: "10px" }}>
              Manage your weekly digest in your{" "}
              <Link
                href={`${APP_URL}/settings?tab=${SettingsTab.NOTIFICATIONS}`}
                style={{ color: "#3f8051", textDecoration: "underline" }}
              >
                notification settings
              </Link>
              .
            </span>
          </Footer>
        </Container>
      </Body>
    </Html>
  );
}

WeeklyNewCompaniesEmail.PreviewProps = {
  newCompanies: PREVIEW_COMPANIES,
} as WeeklyNewCompaniesEmailProps;
