"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { BackButton } from "./BackButton";

export default function ExploreButton() {
  const segment = useSelectedLayoutSegment();
  const isCompanyPage =
    segment === "company" || segment === "location" || segment === "category";

  if (!isCompanyPage) {
    return null;
  }

  return <BackButton />;
}
