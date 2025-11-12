"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsTab, settingsQueryStateKeys } from "@/lib/search-params";
import type { SettingsTabs } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQueryStates } from "nuqs";
import { Title } from "../Title";
import { AccountSettings } from "./account/AccountSettings";
import { NotificationSettings } from "./notification/NotificationSettings";

const TABS: SettingsTabs[] = [
  {
    id: SettingsTab.ACCOUNT,
    title: "Account",
  },
  {
    id: SettingsTab.NOTIFICATIONS,
    title: "Notifications",
  },
];

export const Settings = () => {
  const [settingsTab, setSettingsTab] = useQueryStates(settingsQueryStateKeys, {
    scroll: true,
  });

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <Title title="Settings" description="Manage your account settings." />
      </div>

      <Tabs
        value={settingsTab.tab}
        onValueChange={(value) => setSettingsTab({ tab: value as SettingsTab })}
        className="bold"
      >
        <TabsList className="bg-transparent flex justify-start gap-4 w-full mb-4 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "!bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary font-mono px-0 py-2 flex items-center gap-2",
                tab.disabled && "opacity-80 pointer-events-none",
              )}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={SettingsTab.ACCOUNT} className="p-0.5">
          <AccountSettings />
        </TabsContent>
        <TabsContent value={SettingsTab.NOTIFICATIONS} className="p-0.5">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
