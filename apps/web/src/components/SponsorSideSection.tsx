import { RetroContainer } from "./ui/retro-container";

export default function SponsorSideSection() {
  return (
    <RetroContainer
      variant="static-secondary"
      className="px-4 py-3 lg:w-[290px]"
    >
      <div className="space-y-3 text-center">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          Be a Sponsor 💛
        </h2>
        <p className="text-sm tracking-wide text-gray-500">
          <a
            href="https://x.com/alexlmarques"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-2 underline"
          >
            Contact us
          </a>{" "}
          to become a sponsor or advertiser.
        </p>
      </div>
    </RetroContainer>
  );
}
