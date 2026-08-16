"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SALES_BY_CATEGORY } from "@/lib/mock-data/analytics";
import {
  CHART_AXIS_PROPS,
  CHART_GRID_PROPS,
  CHART_SERIES_PALETTE,
  CHART_TOOLTIP_CONTENT_STYLE,
} from "@/lib/chart-theme";
import { formatPrice } from "@/lib/utils";

function SalesByCategoryChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={SALES_BY_CATEGORY}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
      >
        <CartesianGrid {...CHART_GRID_PROPS} horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
          {...CHART_AXIS_PROPS}
        />
        <YAxis type="category" dataKey="category" width={90} {...CHART_AXIS_PROPS} />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
          formatter={(value) => [formatPrice(Number(value)), "Sales"]}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} isAnimationActive animationDuration={700}>
          {SALES_BY_CATEGORY.map((entry, index) => (
            <Cell key={entry.category} fill={CHART_SERIES_PALETTE[index % CHART_SERIES_PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export { SalesByCategoryChart };
