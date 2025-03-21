"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Button } from "./ui/button";

export default function ExploreButton() {
  const segment = useSelectedLayoutSegment();
  const isCompanyPage = segment === "company";

  if (!isCompanyPage) {
    return null;
  }

  return (
    <Button
      asChild
      className="px-3"
      aria-label="Navigate back to companies list"
    >
      <Link href="/">
        <ArrowLeft className="mr-2 shrink-0" aria-hidden="true" size={16} />
        Back to all companies
      </Link>
    </Button>
  );
}
