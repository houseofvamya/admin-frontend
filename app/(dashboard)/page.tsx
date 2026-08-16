import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Receipt, ArrowRight, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ChartCard } from "@/components/admin/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { RevenueTrendChart } from "@/components/charts/RevenueTrendChart";
import { ADMIN_USERS } from "@/lib/mock-data/users";
import { REVENUE_TREND, SUMMARY_STATS } from "@/lib/mock-data/analytics";
import { PRODUCTS, getLowStockVariants } from "@/lib/mock-data/products";
import { ORDERS } from "@/lib/mock-data/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/lib/types/order";

const admin = ADMIN_USERS[0]!;

// Featured products first (proxy for "top products" — no real sales-count field exists),
// falling back to highest rated so the list is always populated.
const topProducts = [...PRODUCTS]
  .sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return (b.rating ?? 0) - (a.rating ?? 0);
  })
  .slice(0, 5);

const lowStockItems = getLowStockVariants().slice(0, 5);

const recentOrders = [...ORDERS]
  .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
  .slice(0, 6);

const orderColumns: DataTableColumn<Order>[] = [
  {
    key: "orderNumber",
    header: "Order #",
    render: (order) => <span className="font-medium text-charcoal">{order.orderNumber}</span>,
  },
  {
    key: "customer",
    header: "Customer",
    render: (order) => order.customer.name,
  },
  {
    key: "status",
    header: "Status",
    render: (order) => <StatusBadge status={order.status} domain="order" />,
  },
  {
    key: "total",
    header: "Total",
    render: (order) => <span className="tabular-nums">{formatPrice(order.total)}</span>,
  },
  {
    key: "placedAt",
    header: "Date",
    render: (order) => <span className="text-charcoal-soft">{formatDate(order.placedAt)}</span>,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" description={`Welcome back, ${admin.name}.`} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={formatPrice(SUMMARY_STATS.revenue.value)}
          delta={{ value: SUMMARY_STATS.revenue.deltaPct, direction: "up" }}
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={SUMMARY_STATS.orders.value.toLocaleString()}
          delta={{ value: SUMMARY_STATS.orders.deltaPct, direction: "up" }}
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={SUMMARY_STATS.customers.value.toLocaleString()}
          delta={{ value: SUMMARY_STATS.customers.deltaPct, direction: "up" }}
        />
        <StatCard
          icon={Receipt}
          label="Avg Order Value"
          value={formatPrice(SUMMARY_STATS.avgOrderValue.value)}
          delta={{ value: SUMMARY_STATS.avgOrderValue.deltaPct, direction: "up" }}
        />
      </div>

      <ChartCard title="Revenue Trend" subtitle="Last 30 days" height={320}>
        <RevenueTrendChart data={REVENUE_TREND} />
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card variant="soft" className="flex flex-col gap-1 p-6 lg:col-span-2">
          <div className="flex items-center justify-between pb-3">
            <h3 className="font-display text-xl text-charcoal">Top Products</h3>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-gold-deep hover:underline"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-line">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-charcoal">{product.name}</span>
                  <span className="text-xs text-charcoal-soft">{product.category}</span>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-charcoal">
                  {formatPrice(product.price)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="soft" className="flex flex-col gap-1 p-6">
          <div className="flex items-center justify-between pb-3">
            <h3 className="font-display text-xl text-charcoal">Low Stock Alerts</h3>
            <span className="flex size-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="size-4" />
            </span>
          </div>
          <div className="flex flex-col divide-y divide-line">
            {lowStockItems.length === 0 ? (
              <p className="py-6 text-center text-sm text-charcoal-soft">All variants are well stocked.</p>
            ) : (
              lowStockItems.map(({ product, variant }) => (
                <div key={variant.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-charcoal">{product.name}</span>
                    <span className="text-xs text-charcoal-soft">
                      {variant.metal}
                      {variant.size ? ` · ${variant.size}` : ""}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        variant.stock === 0 ? "text-red-600" : "text-amber-600"
                      }`}
                    >
                      {variant.stock} left
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/inventory">Restock</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card variant="flat" className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <CardHeader className="p-0">
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <Link
            href="/orders"
            className="flex items-center gap-1 text-sm font-medium text-gold-deep hover:underline"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <CardContent className="p-0">
          <DataTable columns={orderColumns} data={recentOrders} getRowKey={(order) => order.id} />
        </CardContent>
      </Card>
    </div>
  );
}
