"use client";

import { EmptyState } from "@/components/EmptyState";

export default function ErrorPage() {
  return (
    <EmptyState
      title="Something went wrong"
      description="Please try again later."
    />
  );
}
