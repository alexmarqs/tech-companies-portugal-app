import type { Company } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";
import { HotFeaturedBadge } from "./HotFeaturedBadge";
import { Badge } from "./ui/badge";
import { RetroContainer } from "./ui/retro-container";

type CompanyItemProps = {
  company: Company;
};

export default function CompanyItem({
  company: { name, description, locations, categories, slug, isFeatured },
}: CompanyItemProps) {
  return (
    <RetroContainer
      variant={isFeatured ? "featured" : "default"}
      className="w-full relative"
      data-testid="company-item"
      aria-label={`Company: ${name}`}
    >
      <Link
        className={cn(
          "group flex w-full gap-2 p-5 hover:cursor-pointer hover:bg-muted/40",
        )}
        href={`/company/${slug}`}
        aria-label={`View details for ${name}`}
      >
        <div className="flex w-full flex-col gap-4 ">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <h3 className="line-clamp-1 flex items-center justify-center gap-2 text-lg font-medium">
              {name}
              {isFeatured && <HotFeaturedBadge />}
            </h3>
            <Categories categories={categories || []} />
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
          <Locations locations={locations || []} />
        </div>
        <ChevronRight
          className="shrink-0 self-center text-muted-foreground"
          size={24}
          aria-hidden="true"
        />
      </Link>
    </RetroContainer>
  );
}

export const Locations = ({ locations }: { locations: string[] }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs font-medium">
      <MapPin className="shrink-0" size={16} />
      {locations.map((location, index) => {
        return (
          <React.Fragment key={index}>
            <p className="text-nowrap">{location}</p>
            {index !== locations.length - 1 && (
              <span className="text-muted-foreground">•</span>
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
    <div className="flex flex-wrap items-center justify-center gap-1">
      {categoriesArray.map((category, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="rounded-none text-xs font-semibold tracking-wider"
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};
