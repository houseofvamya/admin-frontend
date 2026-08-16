import * as React from "react";
import { cn } from "@/lib/utils";

export type FilterBarProps = React.HTMLAttributes<HTMLDivElement>;

function FilterBar({ className, children, ...props }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col flex-wrap gap-3 rounded-2xl border border-line bg-cream/40 p-4 sm:flex-row sm:items-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { FilterBar };
