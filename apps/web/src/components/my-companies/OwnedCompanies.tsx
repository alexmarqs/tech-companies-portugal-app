"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetConnectedCompanies } from "@/hooks/my-companies";
import { useSession } from "@/lib/contexts/SessionContext";
import type { ConnectedCompanySummary } from "@/lib/types";
import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "./EmptyState";

const ManageableCompanyCard = ({
  company,
}: {
  company: ConnectedCompanySummary;
}) => {
  const { status, role, hasPendingDraft } = company;

  return (
    <Link
      href={`/my-companies/${company.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label={`Manage ${company.name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 to-primary/5 text-primary font-bold text-sm shrink-0">
            {company.logoUrl ? (
              <img
                className="h-full w-full rounded-lg bg-white object-contain p-0.5"
                src={company.logoUrl}
                alt={company.name}
                width={36}
                height={36}
              />
            ) : (
              company.name.charAt(0)
            )}
          </div>
          <h3 className="line-clamp-1 text-base font-semibold group-hover:text-primary transition-colors">
            {company.name}
          </h3>
        </div>
        <Badge
          variant={role === "owner" ? "default" : "secondary"}
          className="capitalize shrink-0"
        >
          {role}
        </Badge>
      </div>

      <p className="line-clamp-2 flex-1 text-sm text-muted-foreground leading-relaxed">
        {company.description}
      </p>

      <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2">
        <div className="flex items-center gap-1.5">
          {status === "pending" && (
            <Badge variant="secondary" className="text-[10px]">
              Pending review
            </Badge>
          )}
          {hasPendingDraft && (
            <Badge variant="draft" className="text-[10px]">
              Unpublished draft
            </Badge>
          )}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
          Manage
          <ArrowRight
            size={12}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
};

export const OwnedCompanies = () => {
  const { isAuthenticated } = useSession();
  const { data: connectedCompanies, isPending } = useGetConnectedCompanies({
    enabled: isAuthenticated,
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!connectedCompanies || connectedCompanies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No companies connected yet"
        description="Companies you own or manage will appear here. If you received an invitation, accept it via the link in the email first."
        action={
          <Button asChild size="sm">
            <Link href="/submit">Submit a company</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {connectedCompanies.map((company) => (
        <ManageableCompanyCard key={company.slug} company={company} />
      ))}
    </div>
  );
};
