import { NotificationsSideSection } from "./NotificationsSideSection";
import { SearchSideBar } from "./SearchSideBar";

type SideBarProps = {
  locationOptions: string[];
  categoryOptions: string[];
};

export function SideBar({ locationOptions, categoryOptions }: SideBarProps) {
  return (
    <aside className="h-fit shrink-0 flex-col gap-4 lg:sticky lg:top-[60px] lg:flex-col-reverse hidden lg:flex">
      <NotificationsSideSection />
      <SearchSideBar {...{ locationOptions, categoryOptions }} />
    </aside>
  );
}
