import { APP_URL } from "@/lib/metadata";
import { Img, Section } from "@react-email/components";

export function Logo() {
  return (
    <Section className="flex flex-row w-full justify-center">
      <Img
        src={`${APP_URL}/assets/images/logo.png`}
        alt="Tech Companies Portugal"
        width={80}
      />
    </Section>
  );
}
