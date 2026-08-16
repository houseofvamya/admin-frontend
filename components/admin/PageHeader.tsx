import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

function PageHeader({ title, description, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex flex-col gap-2">
        {breadcrumb}
        <h1 className="font-display text-3xl text-charcoal">{title}</h1>
        {description && <p className="text-sm text-charcoal-soft">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}

export { PageHeader };
