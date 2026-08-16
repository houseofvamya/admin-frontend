import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  subtext?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ icon: Icon, heading, subtext, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line px-6 py-16 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-cream text-charcoal-soft">
        <Icon className="size-6" />
      </span>
      <h3 className="font-display text-xl text-charcoal">{heading}</h3>
      {subtext && <p className="max-w-sm text-sm text-charcoal-soft">{subtext}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { EmptyState };
