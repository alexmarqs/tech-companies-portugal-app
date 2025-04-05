"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useTrackAnalytics } from ".";
import { isProd } from "./utils";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isProd) {
      console.log("Mock analytics init");
      return;
    }

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { track } = useTrackAnalytics();

  // Track pageviews
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }

      track({ event: "$pageview", $current_url: url });
    }
  }, [pathname, searchParams, track]);

  return null;
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
