import type { Company } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";

type CompanyItemProps = {
  company: Company;
};

export default function CompanyItem({
  company: {
    name,
    description,
    locations,
    categories,
    slug,
    isFeatured,
    logoUrl,
  },
}: CompanyItemProps) {
  return (
    <Link
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-sm",
        isFeatured ? "border-emerald-500" : "border-border/60",
      )}
      data-testid="company-item"
      aria-label={`View details for ${name}`}
      href={`/company/${slug}`}
    >
      {isFeatured && (
        <div className="absolute -top-2.5 left-4">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
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
                  className="rounded-lg object-cover"
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
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            View Profile
            <ArrowRight size={12} />
          </span>
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
