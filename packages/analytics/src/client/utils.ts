export const isProd =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_POSTHOG_KEY;
