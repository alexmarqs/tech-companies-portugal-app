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
      >
        <TabsList className="bg-transparent flex justify-start gap-1 w-full mb-4 overflow-x-auto scrollbar-hide rounded-none py-2 h-auto">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "relative bg-transparent rounded-none px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full",
                tab.disabled && "opacity-50 pointer-events-none",
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
