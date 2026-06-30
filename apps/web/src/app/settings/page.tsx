import { Settings } from "@/components/settings";
import type { Metadata } from "next/types";
import { Suspense } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  // let's keep this page here for SSR, possibly to prefech some data on the server side, suspense queries etc.

  return (
    <Suspense fallback="">
      <Settings />
    </Suspense>
  );
}
