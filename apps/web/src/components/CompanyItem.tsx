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
        "group relative flex flex-col rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isFeatured
          ? "border-emerald-500/50 bg-linear-to-b from-emerald-50/70 to-card shadow-sm shadow-emerald-500/10 hover:border-emerald-500 hover:shadow-emerald-500/20"
          : "border-border/60 bg-card hover:border-primary/30",
        className,
      )}
      data-testid="company-item"
      aria-label={`View details for ${name}`}
      href={`/company/${slug}`}
    >
      {isFeatured && (
        <div className="absolute -top-2.5 left-4">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-emerald-500/30">
            Featured
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 to-primary/5 text-primary font-bold text-sm shrink-0">
              {logoUrl ? (
                <img
                  className="h-full w-full rounded-lg bg-white object-contain p-0.5"
                  src={logoUrl}
                  alt={name}
                  width={36}
                  height={36}
                />
              ) : (
                name.charAt(0)
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="line-clamp-1 text-base font-semibold group-hover:text-primary transition-colors">
                {name}
              </h3>
            </div>
          </div>
        </div>

        <Categories categories={categories || []} />

        <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <Locations locations={locations || []} />

          {!hideViewProfile && (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition-all">
              View Profile
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export const Locations = ({ locations }: { locations: string[] }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground leading-none">
      <MapPin className="shrink-0 text-primary/60" size={13} />
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
          className="text-[10px] font-semibold tracking-wider rounded-md"
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};
