import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

const containerVariants = cva(
  "rounded-xl border bg-card transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-border/60 shadow-xs hover:shadow-md hover:border-border",
        featured:
          "border-emerald-200 bg-emerald-50 shadow-xs hover:shadow-md ring-1 ring-emerald-100",
        "static-featured":
          "border-emerald-200 bg-emerald-50 shadow-xs ring-1 ring-emerald-100",
        secondary: "border-border shadow-xs hover:shadow-md",
        static: "border-border/60 shadow-xs",
        "static-secondary": "border-border shadow-xs bg-card",
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

function Container({ className, variant, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(containerVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Container, containerVariants };
