import { settingsQueryStateKeys } from "@/lib/search-params";
import { useQueryStates } from "nuqs";

export const useSettingsTab = () => {
  const [settingsTab, setSettingsTab] = useQueryStates(settingsQueryStateKeys, {
    scroll: true,
  });

  return { settingsTab, setSettingsTab };
};
