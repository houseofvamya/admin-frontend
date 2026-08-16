"use client";

import * as React from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ChartCard } from "@/components/admin/ChartCard";
import { Select } from "@/components/ui/Select";
import { ORDERS_VOLUME, REVENUE_TREND, SESSIONS_TREND } from "@/lib/mock-data/analytics";
import type { TimeSeriesPoint } from "@/lib/types/analytics";
import { RevenueAreaChart } from "@/components/charts/RevenueAreaChart";
import { SalesByCategoryChart } from "@/components/charts/SalesByCategoryChart";
import { OrdersVolumeChart } from "@/components/charts/OrdersVolumeChart";
import { SessionsTrendChart } from "@/components/charts/SessionsTrendChart";

type Period = "7d" | "30d" | "90d" | "12mo";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12mo", label: "Last 12 months" },
];

function sliceByPeriod(data: TimeSeriesPoint[], period: Period): TimeSeriesPoint[] {
  // The mock data only spans 30 days — 90d/12mo show the full available range.
  if (period === "7d") return data.slice(-7);
  return data;
}

function AnalyticsDashboard() {
  const [period, setPeriod] = React.useState<Period>("30d");

  const revenueData = React.useMemo(() => sliceByPeriod(REVENUE_TREND, period), [period]);
  const ordersData = React.useMemo(() => sliceByPeriod(ORDERS_VOLUME, period), [period]);
  const sessionsData = React.useMemo(() => sliceByPeriod(SESSIONS_TREND, period), [period]);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Track revenue, sales mix, and site traffic over time."
        actions={
          <Select
            aria-label="Period"
            value={period}
            onChange={(event) => setPeriod(event.target.value as Period)}
            containerClassName="w-44"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        }
      />

      <div className="flex flex-col gap-6">
        <ChartCard title="Revenue Trend" subtitle="Gross revenue over the selected period" height={340}>
          <RevenueAreaChart data={revenueData} />
        </ChartCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Sales by Category" subtitle="Revenue share across product categories">
            <SalesByCategoryChart />
          </ChartCard>
          <ChartCard title="Orders Volume" subtitle="Number of orders placed over the selected period">
            <OrdersVolumeChart data={ordersData} />
          </ChartCard>
        </div>

        <ChartCard
          title="Traffic Overview"
          subtitle="Sessions trend, conversion rate, and average session value"
          height={420}
        >
          <SessionsTrendChart data={sessionsData} />
        </ChartCard>
      </div>
    </div>
  );
}

export { AnalyticsDashboard };
