import { APP_URL } from "@/lib/metadata";
import { Column, Img, Link, Row, Section, Text } from "@react-email/components";

type FooterProps = {
  children?: React.ReactNode;
};

export function Footer({ children }: FooterProps) {
  return (
    <Section
      style={{
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px 16px",
      }}
    >
      <Text
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#111827",
          textAlign: "center",
          margin: "0 0 4px 0",
          lineHeight: "1.5",
        }}
      >
        Tech Companies Portugal
      </Text>

      <Text
        style={{
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center",
          margin: "0 0 4px 0",
          lineHeight: "1.6",
        }}
      >
        Discover tech companies hiring in Portugal — from startups to global
        tech companies.
      </Text>

      <Row
        style={{ textAlign: "center", margin: "0", padding: "8px 0" }}
        align="center"
        width="100%"
      >
        <Column style={{ verticalAlign: "middle", textAlign: "center" }}>
          <Link
            href="https://x.com/alexlmarques"
            style={{
              textDecoration: "none",
              display: "inline-block",
              marginRight: "10px",
            }}
          >
            <Img
              src={`${APP_URL}/assets/images/email/x.png`}
              alt="Follow us on X"
              width={20}
              height={20}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "4px",
                backgroundColor: "#ffffff",
                display: "inline-block",
              }}
            />
          </Link>

          <Link
            href="https://github.com/alexmarqs/tech-companies-portugal-app"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            <Img
              src={`${APP_URL}/assets/images/email/github.png`}
              alt="View our GitHub"
              width={20}
              height={20}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "4px",
                backgroundColor: "#ffffff",
                display: "inline-block",
              }}
            />
          </Link>
        </Column>
      </Row>

      <Text
        style={{
          fontSize: "11px",
          color: "#9ca3af",
          textAlign: "center",
          margin: "8px 0 0 0",
          lineHeight: "1.6",
        }}
      >
        © {new Date().getFullYear()} Tech Companies Portugal. All rights
        reserved.
        <br />
        {children ? (
          children
        ) : (
          <span style={{ fontSize: "10px" }}>
            You received this email because you signed up at{" "}
            <Link
              href={APP_URL}
              style={{ color: "#059669", textDecoration: "underline" }}
            >
              techcompaniesportugal.fyi
            </Link>
          </span>
        )}
      </Text>
    </Section>
  );
}
