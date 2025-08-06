import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, type ButtonProps } from "./ui/button";

type BackButtonProps = ButtonProps & {
  href?: string;
  label?: string;
};

export const BackButton = ({ href, label, ...props }: BackButtonProps) => {
  return (
    <Button asChild aria-label={label || "Back to Home"} size="sm" {...props}>
      <Link
        href={href || "/"}
        className={cn("flex items-center gap-2", props.className)}
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
        {label || "Back to Home"}
      </Link>
    </Button>
  );
};
