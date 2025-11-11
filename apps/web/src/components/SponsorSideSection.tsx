import { RetroContainer } from "./ui/retro-container";

export default function SponsorSideSection() {
  return (
    <RetroContainer
      variant="static-secondary"
      className="px-4 py-3 lg:w-[290px]"
    >
      <div className="space-y-3 text-center">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          Be a Sponsor <span className="text-orange-500">💛</span>
        </h2>
        <p className="text-sm tracking-wide text-gray-500">
          Contact us to become a sponsor or advertiser.
        </p>
      </div>
    </RetroContainer>
  );
}
