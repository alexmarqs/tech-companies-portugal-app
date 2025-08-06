"use client";

import { useQueryState } from "nuqs";
import { BackButton } from "./BackButton";

export const GoHomeLoginButton = () => {
  const [from] = useQueryState("from");

  if (from !== "logout") {
    return null;
  }

  return <BackButton />;
};
