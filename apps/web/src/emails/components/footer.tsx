import { APP_URL } from "@/lib/metadata";
import { Column, Img, Link, Row, Section, Text } from "@react-email/components";

export function Footer() {
  return (
    <Section
      className="bg-slate-100 border-2 border-slate-200 rounded-none p-3"
      style={{
        border: "2px solid #e2e8f0",
        backgroundColor: "#f1f5f9",
        borderBottom: "5px solid #cbd5e1",
        borderRight: "5px solid #cbd5e1",
      }}
    >
      <Text className="text-sm text-gray-700 leading-relaxed text-center font-medium py-1 m-0">
        🇵🇹 <strong>Tech Companies Portugal</strong>
      </Text>

      <Text className="text-xs text-gray-600 leading-relaxed text-center m-0 py-1">
        Discover amazing tech companies across Portugal, all in one place.
      </Text>

      <Row className="text-center m-0 py-2" align="center" width="100%">
        <Column className="align-middle text-center">
          <Link
            href="https://x.com/alexlmarques"
            className="text-black no-underline inline-block mr-3"
          >
            <Img
              src={`${APP_URL}/assets/images/email/x.png`}
              alt="Follow us on X"
              width={20}
              height={20}
              className="border border-gray-300 rounded p-1 bg-white inline-block"
            />
          </Link>

          <Link
            href="https://github.com/alexmarqs/tech-companies-portugal-app"
            className="text-black no-underline inline-block"
          >
            <Img
              src={`${APP_URL}/assets/images/email/github.png`}
              alt="View our GitHub"
              width={20}
              height={20}
              className="border border-gray-300 rounded p-1 bg-white inline-block"
            />
          </Link>
        </Column>
      </Row>

      <Text className="text-xs text-gray-500 leading-relaxed text-center m-0">
        © {new Date().getFullYear()} Tech Companies Portugal. All rights
        reserved.
        <br />
        <span className="text-[10px]">
          You received this email because you signed up at{" "}
          <Link
            href="https://techcompaniesportugal.fyi"
            className="text-gray-600 underline"
          >
            techcompaniesportugal.fyi
          </Link>
        </span>
      </Text>
    </Section>
  );
}
