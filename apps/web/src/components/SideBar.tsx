import { NotificationsSideSection } from "./NotificationsSideSection";
import { SearchSideBar } from "./SearchSideBar";
import SponsorSideSection from "./SponsorSideSection";

type SideBarProps = {
  locationOptions: string[];
  categoryOptions: string[];
};

export function SideBar({ locationOptions, categoryOptions }: SideBarProps) {
  return (
    <aside className="h-fit shrink-0 flex-col gap-4 lg:sticky lg:top-[60px] lg:flex-col-reverse hidden lg:flex">
      <SponsorSideSection />
      <NotificationsSideSection />
      <SearchSideBar {...{ locationOptions, categoryOptions }} />
    </aside>
  );
}
