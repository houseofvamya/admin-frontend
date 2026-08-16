import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export interface StatCardDelta {
  value: number;
  direction: "up" | "down";
}

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  delta?: StatCardDelta;
  children?: React.ReactNode;
  className?: string;
}

function StatCard({ icon: Icon, label, value, delta, children, className }: StatCardProps) {
  return (
    <Card variant="soft" className={cn("flex flex-col gap-4 p-6", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal-soft">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-gold-soft/30 text-gold-deep">
          <Icon className="size-5" />
        </span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <span className="font-display text-3xl tabular-nums text-charcoal">{value}</span>
        {delta && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-sm font-medium tabular-nums",
              delta.direction === "up" ? "text-emerald-600" : "text-red-600",
            )}
          >
            {delta.direction === "up" ? (
              <ArrowUpRight className="size-4" />
            ) : (
              <ArrowDownRight className="size-4" />
            )}
            {Math.abs(delta.value)}%
          </span>
        )}
      </div>

      {children && <div className="pt-1">{children}</div>}
    </Card>
  );
}

export { StatCard };
