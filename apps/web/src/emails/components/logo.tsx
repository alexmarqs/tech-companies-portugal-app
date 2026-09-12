import { APP_URL } from "@/lib/metadata";
import { Column, Img, Row, Section, Text } from "@react-email/components";

type LogoProps = {
  width?: number;
};

export function Logo({ width = 42 }: LogoProps) {
  return (
    <Section>
      <Row style={{ width: "auto", margin: "0 auto" }}>
        <Column style={{ width: `${width}px`, verticalAlign: "middle" }}>
          <Img
            src={`${APP_URL}/assets/images/logo-email.png`}
            alt=""
            width={width}
            height={width}
            style={{ display: "block" }}
          />
        </Column>
        <Column style={{ paddingLeft: "11px", verticalAlign: "middle" }}>
          <Text
            style={{
              color: "#2d2825",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
              lineHeight: "16px",
              margin: 0,
            }}
          >
            Tech Companies
            <br />
            <span style={{ color: "#d85f4a" }}>Portugal</span>
          </Text>
        </Column>
      </Row>
    </Section>
  );
}
