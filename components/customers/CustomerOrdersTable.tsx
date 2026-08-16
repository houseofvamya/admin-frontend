"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import type { Order } from "@/lib/types/order";
import { formatDate, formatPrice } from "@/lib/utils";

export interface CustomerOrdersTableProps {
  orders: Order[];
}

function CustomerOrdersTable({ orders }: CustomerOrdersTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<Order>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      render: (order) => <span className="font-medium text-charcoal">{order.orderNumber}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (order) => <StatusBadge domain="order" status={order.status} />,
    },
    {
      key: "total",
      header: "Total",
      render: (order) => <span className="font-semibold text-charcoal">{formatPrice(order.total)}</span>,
    },
    {
      key: "placedAt",
      header: "Date",
      render: (order) => <span className="text-charcoal-soft">{formatDate(order.placedAt)}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      getRowKey={(order) => order.id}
      onRowClick={(order) => router.push(`/orders/${order.id}`)}
      emptyState={
        <EmptyState
          icon={PackageSearch}
          heading="No orders yet"
          subtext="This customer hasn't placed any orders."
        />
      }
    />
  );
}

export { CustomerOrdersTable };
