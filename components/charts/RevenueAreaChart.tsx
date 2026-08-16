"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimeSeriesPoint } from "@/lib/types/analytics";
import {
  CHART_AXIS_PROPS,
  CHART_COLORS,
  CHART_GRID_PROPS,
  CHART_TOOLTIP_CONTENT_STYLE,
} from "@/lib/chart-theme";
import { formatPrice } from "@/lib/utils";

export interface RevenueAreaChartProps {
  data: TimeSeriesPoint[];
}

function formatShortDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.gold} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART_COLORS.gold} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...CHART_GRID_PROPS} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} {...CHART_AXIS_PROPS} />
        <YAxis
          tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
          {...CHART_AXIS_PROPS}
          width={48}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
          labelFormatter={(value) => formatShortDate(String(value))}
          formatter={(value) => [formatPrice(Number(value)), "Revenue"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={CHART_COLORS.gold}
          strokeWidth={2}
          fill="url(#revenueGradient)"
          isAnimationActive
          animationDuration={700}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { RevenueAreaChart };
