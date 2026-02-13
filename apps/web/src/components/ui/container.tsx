import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const containerVariants = cva(
  "rounded-xl border bg-card transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-border/60 shadow-sm hover:shadow-md hover:border-border",
        featured:
          "border-emerald-200 bg-emerald-50 shadow-sm hover:shadow-md ring-1 ring-emerald-100",
        "static-featured":
          "border-emerald-200 bg-emerald-50 shadow-sm ring-1 ring-emerald-100",
        secondary: "border-border shadow-sm hover:shadow-md",
        static: "border-border/60 shadow-sm",
        "static-secondary": "border-border shadow-sm bg-card",
        destructive: "border-destructive hover:bg-destructive/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

Container.displayName = "Container";

export { Container, containerVariants };
