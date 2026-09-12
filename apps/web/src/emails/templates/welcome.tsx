import { APP_URL } from "@/lib/metadata";
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
        Welcome to Tech Companies Portugal — your map to the Portuguese tech
        ecosystem.
      </Preview>
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
                Your Portugal tech pass
              </Text>
              <Heading
                style={{
                  color: "#2d2825",
                  fontSize: "32px",
                  fontWeight: 700,
                  letterSpacing: "-1.2px",
                  lineHeight: "36px",
                  margin: "0 auto 12px",
                  maxWidth: "450px",
                  textAlign: "center",
                }}
              >
                Welcome aboard, {userFirstname}.
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
                You now have a clearer way to discover the companies shaping
                technology across Portugal.
              </Text>
            </Section>

            <Section
              style={{
                backgroundColor: "#fff3ed",
                borderTop: "1px dashed #debfb1",
                borderBottom: "1px dashed #debfb1",
                padding: "22px 28px",
              }}
            >
              <Text
                style={{
                  color: "#9a5a49",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  margin: "0 0 13px",
                  textTransform: "uppercase",
                }}
              >
                Start exploring
              </Text>
              <Text
                style={{
                  color: "#2d2825",
                  fontSize: "14px",
                  lineHeight: "24px",
                  margin: 0,
                }}
              >
                <span style={{ color: "#3f8051", fontWeight: 700 }}>01</span>
                <span style={{ paddingLeft: "14px" }}>
                  Browse curated startups, scaleups, and global teams
                </span>
                <br />
                <span style={{ color: "#d7a83e", fontWeight: 700 }}>02</span>
                <span style={{ paddingLeft: "14px" }}>
                  Filter by location and category
                </span>
                <br />
                <span style={{ color: "#d85f4a", fontWeight: 700 }}>03</span>
                <span style={{ paddingLeft: "14px" }}>
                  Receive the weekly digest when new companies land
                </span>
              </Text>
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
                Explore companies
              </Button>
              <Text
                style={{
                  color: "#9a8e86",
                  fontSize: "11px",
                  lineHeight: "17px",
                  margin: "16px 0 0",
                }}
              >
                Community-curated. Built for people finding their next move.
              </Text>
            </Section>
          </Section>

          <Footer />
        </Container>
      </Body>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  userFirstname: "Alex",
} as WelcomeEmailProps;
