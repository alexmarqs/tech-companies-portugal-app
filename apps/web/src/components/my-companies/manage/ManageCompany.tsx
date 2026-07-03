"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetConnectedCompany } from "@/hooks/my-companies";
import { useSession } from "@/lib/contexts/SessionContext";
import { ArrowLeft, Building2, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "../EmptyState";
import { CompanyMembers } from "./CompanyMembers";
import { EditCompanyDetails } from "./EditCompanyDetails";

type ManageCompanyProps = {
  slug: string;
  availableCategories: string[];
  availableLocations: string[];
};

const BackLink = () => (
  <Link
    href="/my-companies"
    className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
  >
    <ArrowLeft className="h-4 w-4" />
    My Companies
  </Link>
);

export const ManageCompany = ({
  slug,
  availableCategories,
  availableLocations,
}: ManageCompanyProps) => {
  const { isAuthenticated } = useSession();
  const { data: connected, isPending } = useGetConnectedCompany(slug, {
    enabled: isAuthenticated,
  });
  const [tab, setTab] = useState("details");

  if (isPending) {
    return (
      <div className="container mx-auto max-w-3xl space-y-4 p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="container mx-auto max-w-3xl space-y-4 p-6">
        <BackLink />
        <EmptyState
          icon={Building2}
          title="You don't manage this company"
          description="This company isn't connected to your account, or you don't have access to manage it."
        />
      </div>
    );
  }

  const { company, status, role, members, draft } = connected;
  const isOwner = role === "owner";
  const hasPendingDraft = draft !== null;

  return (
    <div className="container mx-auto max-w-3xl space-y-4 p-6">
      <BackLink />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-primary/5 text-primary font-bold text-lg shrink-0">
            {company.logoUrl ? (
              <img
                className="rounded-lg bg-white object-cover"
                src={company.logoUrl}
                alt={company.name}
                width={44}
                height={44}
              />
            ) : (
              company.name.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{company.name}</h1>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge variant={isOwner ? "default" : "secondary"}>{role}</Badge>
              {status === "pending" && (
                <Badge variant="secondary">Pending review</Badge>
              )}
              {hasPendingDraft && (
                <Badge variant="draft">Unpublished draft</Badge>
              )}
            </div>
          </div>
        </div>
        <Link
          href={`/company/${company.slug}`}
          className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
        >
          View public page
        </Link>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-transparent flex justify-start gap-1 w-full mb-4 overflow-x-auto scrollbar-hide rounded-none py-2 h-auto">
          <TabsTrigger
            value="details"
            className="relative bg-transparent rounded-none px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full"
          >
            Details
          </TabsTrigger>
          {isOwner && (
            <TabsTrigger
              value="members"
              className="relative bg-transparent rounded-none px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full"
            >
              Members
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details" className="p-0.5">
          {status === "pending" ? (
            // Frozen until moderation approves it — RLS enforces the same
            // rule server-side, this just explains it.
            <EmptyState
              icon={Clock}
              title="Pending review"
              description="This company is awaiting moderation. You'll be able to edit its details once it's approved."
            />
          ) : (
            <EditCompanyDetails
              company={company}
              draft={draft}
              availableCategories={availableCategories}
              availableLocations={availableLocations}
              canPublish={isOwner}
            />
          )}
        </TabsContent>

        {isOwner && (
          <TabsContent value="members" className="p-0.5">
            <CompanyMembers
              companySlug={company.slug}
              companyName={company.name}
              members={members}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
