import { HotFeaturedBadge } from "./HotFeaturedBadge";
import { RequestFeaturedButton } from "./RequestFeaturedButton";
import { RetroContainer } from "./ui/retro-container";

export default function FeaturedSideSection() {
  return (
    <RetroContainer
      variant="static-featured"
      className="px-4 py-3 lg:w-[290px]"
    >
      <div className="space-y-3 text-center">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          Get Featured <HotFeaturedBadge />
        </h2>
        <p className="text-sm tracking-wide text-gray-500">
          Reach me out to get your company featured.
        </p>
      </div>
      <RequestFeaturedButton />
    </RetroContainer>
  );
}
