import { trackEvent } from "@tech-companies-portugal/analytics/client";
import { HotFeaturedBadge } from "./HotFeaturedBadge";
import { Button } from "./ui/button";
import { RetroContainer } from "./ui/retro-container";

const requestTitle = encodeURIComponent(
  "Request to get <Your Company Name Here> featured on Tech Companies Portugal",
);
const requestBody = encodeURIComponent(
  "Hello, I am from <Your Company Name Here> and I would like to get featured on Tech Companies Portugal. Here is a little bit about us: <Additional Information Here>",
);
const GITHUB_REQUEST_URL = `https://github.com/alexmarqs/frontend-tech-companies-portugal/issues/new?title=${requestTitle}&body=${requestBody}`;

export default function FeaturedSideSection() {
  return (
    <RetroContainer
      variant="static-featured"
      className="px-4 py-3 md:w-[290px]"
    >
      <div className="space-y-3 text-center">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          Get Featured <HotFeaturedBadge />
        </h2>
        <p className="text-sm tracking-wide text-gray-500">
          Reach me out to get your company featured.
        </p>
      </div>
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
    </RetroContainer>
  );
}
