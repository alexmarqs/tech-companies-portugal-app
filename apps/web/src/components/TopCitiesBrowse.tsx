import { cityBrowseItems } from "@/lib/browse";
import type { Company } from "@/lib/types";
import Link from "next/link";

/**
 * Photo cards linking into the /location pages for TOP_CITIES. Renders nothing
 * if none of them match the current data, rather than an empty section.
 */
export function TopCitiesBrowse({
  companies,
  className,
}: {
  companies: Company[];
  className?: string;
}) {
  const cities = cityBrowseItems(companies);

  if (cities.length === 0) return null;

  return (
    <section aria-labelledby="city-browse-heading" className={className}>
      <h2
        id="city-browse-heading"
        className="text-xl font-semibold tracking-[-0.03em]"
      >
        Top cities
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Top Portuguese cities with tech companies in the directory.
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cities.map((city) => (
          <li key={city.name}>
            <Link
              href={city.href}
              className="group relative flex aspect-3/2 flex-col justify-end overflow-hidden rounded-2xl border border-border/70 shadow-[0_10px_20px_-14px_oklch(0.2_0.03_40/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img
                src={city.imageSrc}
                alt=""
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
              />
              {/* Keeps the label legible whatever the photograph is doing. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent"
              />
              <div className="relative flex flex-col gap-0.5 p-3">
                <span className="text-sm font-semibold text-white">
                  {city.name}
                </span>
                <span className="text-xs text-white/75">
                  {city.count} {city.count === 1 ? "company" : "companies"}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
