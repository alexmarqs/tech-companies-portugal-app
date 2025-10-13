"use client";

import { trackEvent } from "@tech-companies-portugal/analytics/client";
import { Button } from "./ui/button";

const requestTitle = encodeURIComponent(
  "Request to get <Your Company Name Here> featured on Tech Companies Portugal",
);
const requestBody = encodeURIComponent(
  "Hello, I am from <Your Company Name Here> and I would like to get featured on Tech Companies Portugal. Here is a little bit about us: <Additional Information Here>",
);
const GITHUB_REQUEST_URL = `https://github.com/alexmarqs/tech-companies-portugal-app/issues/new?title=${requestTitle}&body=${requestBody}`;

export const RequestFeaturedButton = () => {
  return (
    <Button variant="secondary" asChild className="mt-4 w-full">
      <a
        href={GITHUB_REQUEST_URL}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEvent("request_featured_button_clicked")}
      >
        Request now
      </a>
    </Button>
  );
};
