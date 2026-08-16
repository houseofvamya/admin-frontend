import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export interface ChartCardProps {
  title: string;
  subtitle?: React.ReactNode;
  periodSelector?: React.ReactNode;
  isLoading?: boolean;
  height?: number;
  children: React.ReactNode;
  className?: string;
}

function ChartCard({
  title,
  subtitle,
  periodSelector,
  isLoading = false,
  height = 320,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card variant="soft" className={cn("flex flex-col gap-5 p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-xl text-charcoal">{title}</h3>
          {subtitle && <p className="text-sm text-charcoal-soft">{subtitle}</p>}
        </div>
        {periodSelector}
      </div>

      <div style={{ height }} className="w-full">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : (
          children
        )}
      </div>
    </Card>
  );
}

export { ChartCard };
