import type { HeadingParts } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Page h1 with the category or location tinted, matching its OG image. */
export function AccentHeading({
  lead,
  name,
  trail,
  className,
}: HeadingParts & { className?: string }) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl",
        className,
      )}
    >
      {lead && `${lead} `}
      <span className="text-primary">{name}</span>
      {trail && ` ${trail}`}
    </h1>
  );
}
