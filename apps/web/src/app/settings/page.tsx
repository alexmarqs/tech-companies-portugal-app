import { Settings } from "@/components/settings";
import { Suspense } from "react";

export default function SettingsPage() {
  // let's keep this page here for SSR, possibly to prefech some data on the server side, suspense queries etc.

  return (
    <Suspense fallback="">
      <Settings />
    </Suspense>
  );
}
