import { cn } from "@/lib/utils";

type HotFeaturedBadgeProps = {
  className?: string;
};

export const HotFeaturedBadge = ({ className }: HotFeaturedBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-red-500/90 px-[2px] text-xs font-sans font-bold text-white shadow-sm",
        className,
      )}
      aria-label="Hot feature badge"
    >
      HOT{" "}
      <span className="ml-1" aria-hidden="true">
        🔥
      </span>
    </span>
  );
};
