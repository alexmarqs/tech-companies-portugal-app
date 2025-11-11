import { APP_URL } from "@/lib/metadata";
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
import tailwindConfig from "../../../tailwind.config";
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
      <Tailwind config={tailwindConfig}>
        <Body className="bg-slate-50">
          <Container className="mx-auto py-4 max-w-96">
            {/* Header Section */}
            <Section
              className="bg-white border-2 border-slate-200 rounded-none p-4 mb-5"
              style={{
                border: "2px solid #e2e8f0",
                backgroundColor: "#ffffff",
                borderBottom: "5px solid #f1f5f9",
                borderRight: "5px solid #f1f5f9",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <Logo width={50} height={50} />

              <Heading className="text-3xl font-bold text-gray-800 text-center mt-4 mb-4 leading-tight">
                Weekly Report 📢
              </Heading>

              <Text className="text-lg text-gray-600 text-center leading-relaxed">
                {companyCount} new{" "}
                {companyCount === 1 ? "company" : "companies"} added this week
              </Text>
            </Section>

            {/* Main Content */}
            {companyCount > 0 && (
              <Section
                className="bg-orange-100 border-2 border-orange-200 rounded-none p-4 mb-5"
                style={{
                  border: "2px solid #fed7aa",
                  backgroundColor: "#ffedd5",
                  borderBottom: "5px solid #fed7aa",
                  borderRight: "5px solid #fed7aa",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <Text className="text-base text-gray-700 leading-relaxed font-semibold">
                  🚀 <strong>New Companies This Week:</strong>
                </Text>

                {firstMaxNewCompaniesNewCompanies.map((newCompany, _index) => (
                  <Link
                    key={newCompany.slug}
                    href={`${APP_URL}/company/${newCompany.slug}`}
                    className="text-sm text-gray-700 leading-relaxed block"
                  >
                    <span style={{ marginRight: "8px" }}>•</span>
                    <strong
                      style={{ fontWeight: "600", textDecoration: "underline" }}
                    >
                      {newCompany.name}
                    </strong>
                  </Link>
                ))}

                {remainingCount > 0 && (
                  <Text className="text-sm text-gray-600 leading-relaxed">
                    <Link href={APP_URL} className="text-gray-700">
                      (and {remainingCount} more...)
                    </Link>
                  </Text>
                )}

                <Section className="text-center py-4">
                  <Button
                    href={APP_URL}
                    className="bg-white text-slate-900 text-base font-semibold no-underline py-3.5 px-7 rounded-none border-2 border-slate-900 inline-block"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#0f172a",
                      textDecoration: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                      padding: "14px 28px",
                      border: "2px solid #0f172a",
                      borderBottom: "5px solid #0f172a",
                      borderRight: "5px solid #0f172a",
                      display: "inline-block",
                    }}
                  >
                    Explore All →
                  </Button>
                </Section>
              </Section>
            )}

            <Footer>
              <span className="text-[10px]">
                Manage your notifications at{" "}
                <Link
                  href={`${APP_URL}/settings`}
                  className="text-gray-600 underline"
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
