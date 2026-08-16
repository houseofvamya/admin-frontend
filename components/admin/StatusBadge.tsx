import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/Badge";

export type StatusDomain = "order" | "product" | "user" | "stock";

type StatusStyle = { variant: BadgeProps["variant"]; className?: string; label?: string };

const ORDER_STATUS: Record<string, StatusStyle> = {
  pending: { variant: "warning" },
  processing: { variant: "outline", className: "border-transparent bg-blue-100 text-blue-700" },
  shipped: { variant: "gold" },
  delivered: { variant: "success" },
  cancelled: { variant: "danger" },
};

const PRODUCT_STATUS: Record<string, StatusStyle> = {
  active: { variant: "success" },
  draft: { variant: "neutral" },
  archived: { variant: "outline" },
};

const USER_STATUS: Record<string, StatusStyle> = {
  active: { variant: "success" },
  invited: { variant: "warning" },
  suspended: { variant: "danger" },
};

const STOCK_STATUS: Record<string, StatusStyle> = {
  "in-stock": { variant: "success" },
  "low-stock": { variant: "warning" },
  "out-of-stock": { variant: "danger" },
};

const DOMAIN_MAP: Record<StatusDomain, Record<string, StatusStyle>> = {
  order: ORDER_STATUS,
  product: PRODUCT_STATUS,
  user: USER_STATUS,
  stock: STOCK_STATUS,
};

export interface StatusBadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className"> {
  status: string;
  domain: StatusDomain;
  className?: string;
}

function formatLabel(status: string) {
  return status
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function StatusBadge({ status, domain, className, ...props }: StatusBadgeProps) {
  const style = DOMAIN_MAP[domain][status.toLowerCase()] ?? { variant: "neutral" as const };

  return (
    <Badge variant={style.variant} className={cn(style.className, className)} {...props}>
      {style.label ?? formatLabel(status)}
    </Badge>
  );
}

export { StatusBadge };
