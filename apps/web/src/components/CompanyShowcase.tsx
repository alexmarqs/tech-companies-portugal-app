import type { ShowcaseCompany } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import Link from "next/link";

type CompanyShowcaseProps = {
  companies: ShowcaseCompany[];
};

const DROP_STAGGER_MS = 55;

// Deterministic per-slot pose so the pile looks tossed, not gridded, and the
// server and client agree on every value.
const poseFor = (index: number) =>
  ({
    "--rot": `${((index * 37) % 19) - 9}deg`,
    "--dy": `${(index * 13) % 11}px`,
    "--delay": `${index * DROP_STAGGER_MS}ms`,
  }) as React.CSSProperties;

/**
 * A pile of company logos that drops into the hero. Featured logos are
 * rendered last so they fall onto the top of the pile.
 */
export function CompanyShowcase({ companies }: CompanyShowcaseProps) {
  if (companies.length === 0) return null;

  const pile = [...companies].sort(
    (a, b) => Number(Boolean(a.isFeatured)) - Number(Boolean(b.isFeatured)),
  );

  return (
    <aside
      className="w-full min-w-0 lg:justify-self-end"
      aria-label="Companies in the directory"
    >
      <ul
        className={cn(
          "relative flex w-full flex-wrap-reverse content-start items-end justify-center gap-2 overflow-clip px-2 pb-3 [overflow-clip-margin:4rem] lg:max-w-[470px] lg:px-4",
          "after:pointer-events-none after:absolute after:inset-x-6 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-border after:to-transparent",
        )}
      >
        {pile.map((company, index) => (
          <li
            key={company.slug}
            className="logo-ball group/ball relative hover:z-20 focus-within:z-20"
            style={poseFor(index)}
          >
            <Link
              href={`/company/${company.slug}`}
              aria-label={`View details for ${company.name}`}
              className={cn(
                "flex items-center justify-center rounded-full border bg-card shadow-[0_10px_20px_-12px_oklch(0.2_0.03_40/0.5),0_1px_2px_oklch(0.2_0.03_40/0.08)]",
                "transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-105",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                company.isFeatured
                  ? "size-12 border-primary/40 ring-4 ring-primary/10 lg:size-16"
                  : "size-10 border-border/80 lg:size-14",
              )}
            >
              <img
                src={company.logoUrl}
                alt=""
                width={56}
                height={56}
                className="size-full rounded-full object-contain p-2 lg:p-2.5"
              />
            </Link>
            <span
              className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background opacity-0 shadow-sm transition-opacity duration-0 group-focus-within/ball:opacity-100 group-focus-within/ball:duration-200 group-hover/ball:opacity-100 group-hover/ball:duration-200 lg:block"
              aria-hidden="true"
            >
              {company.name}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
