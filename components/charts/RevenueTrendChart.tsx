"use client";

import * as React from "react";
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

export interface RevenueTrendChartProps {
  data: TimeSeriesPoint[];
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(value),
  );
}

function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.gold} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART_COLORS.gold} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...CHART_GRID_PROPS} />
        <XAxis
          {...CHART_AXIS_PROPS}
          dataKey="date"
          tickFormatter={formatShortDate}
          interval="preserveStartEnd"
          minTickGap={32}
        />
        <YAxis
          {...CHART_AXIS_PROPS}
          width={64}
          tickFormatter={(value: number) => formatPrice(value)}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
          labelFormatter={(label) => formatShortDate(String(label))}
          formatter={(value) => [formatPrice(Number(value)), "Revenue"] as [string, string]}
          cursor={{ stroke: CHART_COLORS.gold, strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={CHART_COLORS.gold}
          strokeWidth={2}
          fill="url(#revenueTrendFill)"
          activeDot={{ r: 4, fill: CHART_COLORS.gold, stroke: CHART_COLORS.ivory, strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { RevenueTrendChart };
