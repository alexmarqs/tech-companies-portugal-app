"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SettingsTab } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BackButton } from "../BackButton";
import { Title } from "../Title";
import { Badge } from "../ui/badge";
import { AccountSettings } from "./account/AccountSettings";

const TABS = [
  {
    id: "account",
    title: "Account",
  },
  {
    id: "notifications",
    title: "Notifications",
    disabled: true,
    badge: (
      <Badge className="rounded-none" variant="default">
        Coming soon
      </Badge>
    ),
  },
] satisfies SettingsTab[];

export const Settings = () => {
  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <BackButton className="mb-4" />
        <Title title="Settings" description="Manage your account settings." />
      </div>

      <Tabs defaultValue="account" className="bold">
        <TabsList className="bg-transparent flex justify-start gap-4 w-full mb-4">
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
              {tab.badge && tab.badge}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        <TabsContent value="notifications">
          {/* <NotificationsSettings /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};
