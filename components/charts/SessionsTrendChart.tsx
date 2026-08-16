"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TimeSeriesPoint } from "@/lib/types/analytics";
import { SESSIONS_TREND, SUMMARY_STATS } from "@/lib/mock-data/analytics";
import { CHART_AXIS_PROPS, CHART_COLORS, CHART_GRID_PROPS, CHART_TOOLTIP_CONTENT_STYLE } from "@/lib/chart-theme";
import { formatPrice } from "@/lib/utils";

export interface SessionsTrendChartProps {
  data: TimeSeriesPoint[];
}

function formatShortDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const TOTAL_SESSIONS = SESSIONS_TREND.reduce((sum, point) => sum + point.value, 0);
const CONVERSION_RATE = clamp((SUMMARY_STATS.orders.value / TOTAL_SESSIONS) * 100, 0, 100);
const AVG_SESSION_VALUE = SUMMARY_STATS.revenue.value / TOTAL_SESSIONS;

function SessionsTrendChart({ data }: SessionsTrendChartProps) {
  const tiles = [
    { label: "Sessions", value: TOTAL_SESSIONS.toLocaleString("en-US") },
    { label: "Conversion Rate", value: `${CONVERSION_RATE.toFixed(1)}%` },
    { label: "Avg. Session Value", value: formatPrice(AVG_SESSION_VALUE) },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid {...CHART_GRID_PROPS} />
            <XAxis dataKey="date" tickFormatter={formatShortDate} {...CHART_AXIS_PROPS} />
            <YAxis allowDecimals={false} {...CHART_AXIS_PROPS} width={40} />
            <Tooltip
              contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
              labelFormatter={(value) => formatShortDate(String(value))}
              formatter={(value) => [Number(value), "Sessions"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.goldDeep}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-line bg-ivory px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-soft">{tile.label}</p>
            <p className="mt-1 font-display text-xl text-charcoal">{tile.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { SessionsTrendChart };
