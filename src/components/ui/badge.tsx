import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "teal" | "purple" | "magenta" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-text-primary border-white/15",
    teal: "bg-teal/20 text-teal border-teal/30",
    purple: "bg-purple/20 text-purple-light border-purple/30",
    magenta: "bg-magenta/20 text-magenta border-magenta/30",
    outline: "bg-transparent text-text-primary border-white/20",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
