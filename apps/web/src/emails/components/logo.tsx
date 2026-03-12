import { APP_URL } from "@/lib/metadata";
import { Img, Section } from "@react-email/components";

type LogoProps = {
  width?: number;
  height?: number;
};

export function Logo({ width = 80, height = 80 }: LogoProps) {
  return (
    <Section style={{ textAlign: "center" }}>
      <Img
        src={`${APP_URL}/assets/images/logo.png`}
        alt="Tech Companies Portugal"
        width={width}
        height={height}
        style={{ margin: "0 auto" }}
      />
    </Section>
  );
}
