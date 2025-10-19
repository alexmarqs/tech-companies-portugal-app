import posthog from "posthog-js";

export const isProd =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_POSTHOG_KEY;

export const trackEvent = (
  event: string,
  metadata?: Record<string, unknown>,
) => {
  if (isProd) {
    posthog.capture(event, metadata);
  }
};
