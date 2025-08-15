import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const retroContainerVariants = cva(
  "font-mono border-2 transition-all bg-white",
  {
    variants: {
      variant: {
        default:
          "border-accent shadow-[3px_3px_0_0_hsl(var(--accent))] hover:shadow-none hover:translate-x-1 hover:translate-y-0.5",
        featured:
          "border-orange-200 bg-orange-100 hover:shadow-none hover:translate-x-1 hover:translate-y-0.5 shadow-[3px_3px_0_0_hsl(var(--orange))]",
        "static-featured":
          "border-orange-200 bg-orange-100 shadow-[3px_3px_0_0_hsl(var(--orange))] hover:translate-x-0 hover:translate-y-0 hover:shadow-[3px_3px_0_0_hsl(var(--orange))]",
        secondary:
          "border-accent-foreground shadow-[3px_3px_0_0_hsl(var(--accent-foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-0.5",
        static:
          "border-accent shadow-[3px_3px_0_0_hsl(var(--accent))] hover:translate-x-0 hover:translate-y-0 hover:shadow-[3px_3px_0_0_hsl(var(--accent))]",
        "static-secondary":
          "border-accent-foreground shadow-[3px_3px_0_0_hsl(var(--accent-foreground))] hover:translate-x-0 hover:translate-y-0 hover:shadow-[3px_3px_0_0_hsl(var(--accent-foreground))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface RetroContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof retroContainerVariants> {}

const RetroContainer = React.forwardRef<HTMLDivElement, RetroContainerProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(retroContainerVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

RetroContainer.displayName = "RetroContainer";

export { RetroContainer, retroContainerVariants };
