import { APP_URL } from "@/lib/metadata";
import { Column, Img, Link, Row, Section, Text } from "@react-email/components";

type FooterProps = {
  children?: React.ReactNode;
};

export function Footer({ children }: FooterProps) {
  return (
    <Section
      style={{
        padding: "24px 20px 8px",
      }}
    >
      <Text
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#2d2825",
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
          color: "#766b64",
          textAlign: "center",
          margin: "0 0 4px 0",
          lineHeight: "1.6",
        }}
      >
        A curated map of startups, scaleups, and global tech teams across
        Portugal.
      </Text>

      <Row
        style={{ textAlign: "center", margin: "0", padding: "10px 0 6px" }}
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
                border: "1px solid #e6dbd1",
                borderRadius: "8px",
                padding: "4px",
                backgroundColor: "#fffdf9",
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
                border: "1px solid #e6dbd1",
                borderRadius: "8px",
                padding: "4px",
                backgroundColor: "#fffdf9",
                display: "inline-block",
              }}
            />
          </Link>
        </Column>
      </Row>

      <Text
        style={{
          fontSize: "11px",
          color: "#9a8e86",
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
              style={{ color: "#3f8051", textDecoration: "underline" }}
            >
              techcompaniesportugal.fyi
            </Link>
          </span>
        )}
      </Text>
    </Section>
  );
}
