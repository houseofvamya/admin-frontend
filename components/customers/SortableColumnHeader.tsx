"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SortableColumnHeaderProps {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
}

function SortableColumnHeader({ label, active, direction, onClick }: SortableColumnHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-colors",
        active ? "text-gold-deep" : "text-charcoal-soft hover:text-charcoal",
      )}
    >
      {label}
      {active ? (
        direction === "asc" ? (
          <ArrowUp className="size-3.5" />
        ) : (
          <ArrowDown className="size-3.5" />
        )
      ) : (
        <ArrowUpDown className="size-3.5 opacity-40" />
      )}
    </button>
  );
}

export { SortableColumnHeader };
