"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { BackButton } from "./BackButton";

/**
 * Shows a back button on company detail pages, category pages, and location pages.
 * Uses browser history to navigate back to the previous page.
 */
export default function ExploreButton() {
  const segment = useSelectedLayoutSegment();
  const isDetailPage =
    segment === "company" || segment === "location" || segment === "category";

  if (!isDetailPage) {
    return null;
  }

  return <BackButton label="Back to Companies" useBrowserHistory={true} />;
}
