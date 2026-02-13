import { cn } from "@/lib/utils";

type HotFeaturedBadgeProps = {
  className?: string;
};

export const HotFeaturedBadge = ({ className }: HotFeaturedBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-sans font-bold text-white shadow-sm",
        className,
      )}
      aria-label="Hot feature badge"
    >
      HOT
      <span className="ml-0.5" aria-hidden="true">
        🔥
      </span>
    </span>
  );
};
