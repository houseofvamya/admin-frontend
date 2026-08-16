"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TimeSeriesPoint } from "@/lib/types/analytics";
import { CHART_AXIS_PROPS, CHART_COLORS, CHART_GRID_PROPS, CHART_TOOLTIP_CONTENT_STYLE } from "@/lib/chart-theme";

export interface OrdersVolumeChartProps {
  data: TimeSeriesPoint[];
}

function formatShortDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function OrdersVolumeChart({ data }: OrdersVolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid {...CHART_GRID_PROPS} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} {...CHART_AXIS_PROPS} />
        <YAxis allowDecimals={false} {...CHART_AXIS_PROPS} width={32} />
        <Tooltip
          cursor={{ fill: CHART_COLORS.cream }}
          contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
          labelFormatter={(value) => formatShortDate(String(value))}
          formatter={(value) => [Number(value), "Orders"]}
        />
        <Bar dataKey="value" fill={CHART_COLORS.charcoal} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={700} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export { OrdersVolumeChart };
