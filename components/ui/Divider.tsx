import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
}

function Divider({ orientation = "horizontal", label, className, ...props }: DividerProps) {
  if (orientation === "vertical") {
    return <div className={cn("w-px self-stretch bg-line", className)} {...props} />;
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-3 text-xs text-charcoal-soft", className)} {...props}>
        <span className="h-px flex-1 bg-line" />
        {label}
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }

  return <div className={cn("h-px w-full bg-line", className)} {...props} />;
}

export { Divider };
