"use client";

import type { Properties } from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { useCallback } from "react";
import { isProd } from "./utils";

export const useTrackAnalytics = () => {
  const { capture } = usePostHog();

  const track = useCallback(
    (options: { event: string } & Properties) => {
      if (!isProd) {
        console.log(`Mock analytics track: ${options.event}`, options);
        return;
      }

      const { event, ...rest } = options;

      capture(event, rest);
    },
    [capture],
  );

  return {
    track,
  };
};
