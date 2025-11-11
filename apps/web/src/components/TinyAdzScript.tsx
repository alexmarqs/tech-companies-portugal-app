import { isProd } from "@/lib/utils";
import Script from "next/script";

const TINY_ADZ_SITE_ID = process.env.NEXT_PUBLIC_TINY_ADZ_SITE_ID;
const TINY_ADZ_SCRIPT_URL = "https://cdn.apitiny.net/scripts/v2.0/main.js";

export const TinyAdzScript = () => {
  if (!TINY_ADZ_SITE_ID) {
    return null;
  }

  return (
    <Script
      src={TINY_ADZ_SCRIPT_URL}
      data-site-id={TINY_ADZ_SITE_ID}
      data-test-mode={isProd ? "false" : "true"}
      async
    />
  );
};
