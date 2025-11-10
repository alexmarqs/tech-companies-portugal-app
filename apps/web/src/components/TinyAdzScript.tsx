import Script from "next/script";

const isProd = process.env.NODE_ENV === "production";

export const TinyAdzScript = () => {
  return (
    <Script
      src="https://cdn.apitiny.net/scripts/v2.0/main.js"
      data-site-id="6910ba257b7bb1e7eff64e0a"
      data-test-mode={isProd ? "false" : "true"}
      async
    />
  );
};
