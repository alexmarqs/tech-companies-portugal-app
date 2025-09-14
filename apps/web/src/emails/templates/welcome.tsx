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
  userFirstname: string;
}

export const WelcomeEmail = ({ userFirstname }: WelcomeEmailProps) => (
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
      <Body className="bg-slate-50">
        <Container className="flex flex-col max-w-[600px] mx-auto p-4">
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
            <Logo />

            <Heading className="text-3xl font-bold text-gray-800 text-center mt-4 mb-4 leading-tight">
              Welcome to Tech Companies Portugal! 🇵🇹
            </Heading>

            <Text className="text-lg text-gray-600 text-center leading-relaxed">
              Hi {userFirstname}, thanks for joining the community 🎉
            </Text>
          </Section>

          {/* Main Content */}
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
            <Text className="text-base text-gray-700 leading-relaxed mb-6">
              🚀 <strong>Ready to start exploring?</strong>
            </Text>

            <Text className="text-sm text-gray-600 leading-relaxed mb-3 pl-5">
              • Explore <strong>300+</strong> tech companies across Portugal
            </Text>

            <Text className="text-sm text-gray-600 leading-relaxed mb-3 pl-5">
              • Filter by location, category and more!
            </Text>

            <Text className="text-sm text-gray-600 leading-relaxed pl-5">
              • Reveive notifications when new companies are added (coming soon)
            </Text>

            <Section className="text-center py-4">
              <Button
                href="https://techcompaniesportugal.fyi"
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
                Explore Companies Now →
              </Button>
            </Section>
          </Section>

          {/* Features Section */}
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
            <Heading className="text-xl font-semibold text-gray-800 mb-5">
              Open source 💙
            </Heading>

            <Text className="text-sm text-gray-600 leading-relaxed mb-4">
              🌐 <strong>Open Source Platform:</strong> Our web application is
              completely open source and transparent:{" "}
              <a
                href="https://github.com/alexmarqs/frontend-tech-companies-portugal"
                target="_blank"
                rel="noreferrer"
              >
                tech-companies-portugal-app
              </a>
            </Text>

            <Text className="text-sm text-gray-600 leading-relaxed mb-4">
              🤝 <strong>Community Powered Data:</strong> We source our company
              data from the amazing open source repository maintained by the
              Portuguese tech community, keeping it always fresh through their
              contributions:{" "}
              <a
                href="https://github.com/marmelo/tech-companies-in-portugal"
                target="_blank"
                rel="noreferrer"
              >
                tech-companies-in-portugal
              </a>
            </Text>
          </Section>

          <Footer />
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

WelcomeEmail.PreviewProps = {
  userFirstname: "Alex",
} as WelcomeEmailProps;

export default WelcomeEmail;
