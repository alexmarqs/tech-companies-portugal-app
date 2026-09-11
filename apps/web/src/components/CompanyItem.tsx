import type { Company } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";

type CompanyItemProps = {
  company: Company;
  className?: string;
  hideViewProfile?: boolean;
};

export default function CompanyItem({
  className,
  company: {
    name,
    description,
    locations,
    categories,
    slug,
    isFeatured,
    logoUrl,
  },
  hideViewProfile = false,
}: CompanyItemProps) {
  return (
    <Link
      className={cn(
        "group relative flex flex-col rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-28px_oklch(0.3_0.04_40/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-5",
        isFeatured
          ? "border-primary/20 bg-accent/65 hover:border-primary/35"
          : "border-border/70 bg-card hover:border-primary/25",
        className,
      )}
      data-testid="company-item"
      aria-label={`View details for ${name}`}
      href={`/company/${slug}`}
    >
      {isFeatured && (
        <div className="absolute -top-2.5 left-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
            Featured
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background text-sm font-bold text-primary sm:size-14">
            {logoUrl ? (
              <img
                className="size-full rounded-xl bg-card object-contain p-1"
                src={logoUrl}
                alt={name}
                width={56}
                height={56}
              />
            ) : (
              name.charAt(0)
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold tracking-tight transition-colors group-hover:text-primary sm:text-lg">
                {name}
              </h3>
              <Categories categories={categories || []} />
            </div>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <Locations locations={locations || []} />
          </div>
        </div>

        {!hideViewProfile && (
          <span className="ml-15 inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-all sm:ml-0 sm:self-center">
            View company
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </Link>
  );
}

export const Locations = ({ locations }: { locations: string[] }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs leading-none text-muted-foreground">
      <MapPin className="size-3 shrink-0 text-primary" />
      {locations.map((location, index) => {
        return (
          <React.Fragment key={location}>
            <span className="text-nowrap">{location}</span>
            {index !== locations.length - 1 && (
              <span className="text-border">&#8226;</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const Categories = ({
  categories,
}: {
  categories: string[] | string;
}) => {
  const categoriesArray = Array.isArray(categories) ? categories : [categories];

  return (
    <div className="flex flex-wrap items-center gap-1">
      {categoriesArray.map((category) => (
        <Badge
          key={category}
          variant="secondary"
          className="rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide"
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};
