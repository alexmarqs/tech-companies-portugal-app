"use client";

import { useQueryState } from "nuqs";
import { BackButton } from "./BackButton";

/**
 * Shows a back button on the login page when user comes from logout.
 * This helps users easily return to the home page after logging out.
 */
export const GoHomeLoginButton = () => {
  const [from] = useQueryState("from");

  // Only show back button when user came from logout
  if (from !== "logout") {
    return null;
  }

  return <BackButton label="Back to Home" />;
};
