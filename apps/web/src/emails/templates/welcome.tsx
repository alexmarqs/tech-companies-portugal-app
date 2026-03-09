import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Footer } from "../components/footer";
import { Logo } from "../components/logo";
interface WelcomeEmailProps {
  userFirstname?: string;
}

export default function WelcomeEmail({
  userFirstname = "there",
}: WelcomeEmailProps) {
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
        Welcome to Tech Companies Portugal - Discover your next career
        opportunity!
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50">
          <Container className="flex flex-col max-w-[600px] mx-auto p-4">
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
              <Logo />

              <Heading
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#111827",
                  textAlign: "center",
                  margin: "20px 0 12px 0",
                  lineHeight: "1.2",
                  letterSpacing: "-0.02em",
                }}
              >
                Welcome to Tech Companies Portugal!
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
                Hi {userFirstname}, thanks for joining the community
              </Text>
            </Section>

            {/* Main Content */}
            <Section
              style={{
                background:
                  "linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 50%, #ecfdf5 100%)",
                border: "1px solid #a7f3d0",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "16px",
              }}
            >
              <Text
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#065f46",
                  lineHeight: "1.5",
                  margin: "0 0 16px 0",
                }}
              >
                Ready to start exploring?
              </Text>

              <Text
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  lineHeight: "1.7",
                  margin: "0 0 8px 0",
                  paddingLeft: "8px",
                }}
              >
                • Explore <strong>300+</strong> tech companies across Portugal
              </Text>

              <Text
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  lineHeight: "1.7",
                  margin: "0 0 8px 0",
                  paddingLeft: "8px",
                }}
              >
                • Filter by location, category and more
              </Text>

              <Text
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  lineHeight: "1.7",
                  margin: "0 0 20px 0",
                  paddingLeft: "8px",
                }}
              >
                • Get weekly notifications when new companies are added
              </Text>

              <Section className="text-center py-2">
                <Button
                  href="https://techcompaniesportugal.fyi"
                  style={{
                    backgroundColor: "#059669",
                    color: "#ffffff",
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

            {/* Features Section */}
            <Section
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: "13px",
                  color: "#4b5563",
                  lineHeight: "1.7",
                  margin: "0 0 12px 0",
                }}
              >
                <strong>Open Source Platform:</strong> Our web application is
                completely open source and transparent:{" "}
                <a
                  href="https://github.com/alexmarqs/tech-companies-portugal-app"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#059669", textDecoration: "underline" }}
                >
                  tech-companies-portugal-app
                </a>
              </Text>
            </Section>

            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  userFirstname: "Alex",
} as WelcomeEmailProps;
