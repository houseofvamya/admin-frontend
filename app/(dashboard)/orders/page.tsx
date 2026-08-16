"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Download, PackageSearch } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { SearchInput } from "@/components/admin/SearchInput";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { ORDERS } from "@/lib/mock-data/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types/order";

const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const sortedOrders = [...ORDERS].sort(
  (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
);

export default function OrdersPage() {
  const router = useRouter();
  const [status, setStatus] = React.useState<OrderStatus | "all">("all");
  const [query, setQuery] = React.useState("");

  const filteredOrders = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sortedOrders.filter((order) => {
      const matchesStatus = status === "all" || order.status === status;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        order.orderNumber.toLowerCase().includes(normalizedQuery) ||
        order.customer.name.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [status, query]);

  const columns: DataTableColumn<Order>[] = [
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
      key: "items",
      header: "Items",
      render: (order) => order.lineItems.reduce((sum, item) => sum + item.quantity, 0),
    },
    {
      key: "total",
      header: "Total",
      render: (order) => <span className="tabular-nums">{formatPrice(order.total)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (order) => <StatusBadge status={order.status} domain="order" />,
    },
    {
      key: "placedAt",
      header: "Date",
      render: (order) => <span className="text-charcoal-soft">{formatDate(order.placedAt)}</span>,
    },
    {
      key: "chevron",
      header: "",
      render: () => <ChevronRight className="size-4 text-charcoal-soft" />,
      className: "w-8",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description="Track and manage customer orders."
        actions={
          <Button variant="outline">
            <Download className="size-4" />
            Export
          </Button>
        }
      />

      <FilterBar>
        <Select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | "all")}
          className="sm:w-52"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <SearchInput
          placeholder="Search by order # or customer..."
          showShortcutHint={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          containerClassName="sm:flex-1"
        />
      </FilterBar>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          heading="No orders found"
          subtext="Try adjusting your filters or search term."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          getRowKey={(order) => order.id}
          onRowClick={(order) => router.push(`/orders/${order.id}`)}
        />
      )}
    </div>
  );
}
