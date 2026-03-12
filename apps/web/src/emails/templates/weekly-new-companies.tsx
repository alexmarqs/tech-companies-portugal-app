import { APP_URL } from "@/lib/metadata";
import { SettingsTab } from "@/lib/search-params";
import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
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

const MAX_NEW_COMPANIES_TO_SHOW = 20;

export default function WeeklyNewCompaniesEmail({
  newCompanies,
}: WeeklyNewCompaniesEmailProps) {
  const companyCount = newCompanies.length;
  const firstMaxNewCompaniesNewCompanies = newCompanies.slice(
    0,
    MAX_NEW_COMPANIES_TO_SHOW,
  );
  const remainingCount = companyCount - MAX_NEW_COMPANIES_TO_SHOW;

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
      <Preview>
        Weekly Report | {companyCount.toString()} New{" "}
        {companyCount === 1 ? "Company" : "Companies"} Added This Week
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50">
          <Container className="mx-auto py-4 max-w-96">
            {/* Header Section */}
            <Section
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "32px 24px",
                marginBottom: "16px",
              }}
            >
              <Logo width={50} height={50} />

              <Heading
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#111827",
                  textAlign: "center",
                  margin: "20px 0 12px 0",
                  lineHeight: "1.2",
                  letterSpacing: "-0.02em",
                }}
              >
                This week in Portuguese tech
              </Heading>

              <Text
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  textAlign: "center",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {companyCount} new{" "}
                {companyCount === 1 ? "company" : "companies"} added this week
              </Text>
            </Section>

            {/* Main Content */}
            {companyCount > 0 && (
              <Section
                style={{
                  backgroundColor: "#059669",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "16px",
                }}
              >
                {firstMaxNewCompaniesNewCompanies.map((newCompany) => (
                  <Link
                    key={newCompany.slug}
                    href={`${APP_URL}/company/${newCompany.slug}`}
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: "#d1fae5",
                      lineHeight: "2",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ marginRight: "8px", color: "#ffffff" }}>
                      •
                    </span>
                    <strong
                      style={{
                        fontWeight: 600,
                        textDecoration: "underline",
                        color: "#ffffff",
                      }}
                    >
                      {newCompany.name}
                    </strong>
                  </Link>
                ))}

                {remainingCount > 0 && (
                  <Text
                    style={{
                      fontSize: "13px",
                      color: "#d1fae5",
                      lineHeight: "1.6",
                      margin: "8px 0 0 0",
                    }}
                  >
                    <Link href={APP_URL} style={{ color: "#ffffff" }}>
                      (and {remainingCount} more...)
                    </Link>
                  </Text>
                )}

                <Section className="text-center py-1">
                  <Button
                    href={APP_URL}
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#059669",
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: 600,
                      padding: "12px 28px",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                  >
                    Explore Companies
                  </Button>
                </Section>
              </Section>
            )}

            <Footer>
              <span style={{ fontSize: "10px" }}>
                Manage your notifications at{" "}
                <Link
                  href={`${APP_URL}/settings?tab=${SettingsTab.NOTIFICATIONS}`}
                  style={{ color: "#059669", textDecoration: "underline" }}
                >
                  settings
                </Link>
                .
              </span>
            </Footer>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WeeklyNewCompaniesEmail.PreviewProps = {
  newCompanies: [
    {
      slug: "google",
      name: "Google",
    },
    {
      slug: "twitter",
      name: "Twitter",
    },
    {
      slug: "epilot",
      name: "Epilot",
    },
  ],
} as WeeklyNewCompaniesEmailProps;
