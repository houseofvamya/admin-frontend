"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SearchInput } from "@/components/admin/SearchInput";
import { SortableColumnHeader } from "@/components/customers/SortableColumnHeader";
import { CUSTOMERS } from "@/lib/mock-data/customers";
import type { Customer } from "@/lib/types/customer";
import { formatDate, formatPrice } from "@/lib/utils";

type SortKey = "orderCount" | "lifetimeValue" | "lastOrderAt";
type SortDirection = "asc" | "desc";

export default function CustomersPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  }

  const filteredCustomers = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = needle
      ? CUSTOMERS.filter(
          (customer) =>
            customer.name.toLowerCase().includes(needle) || customer.email.toLowerCase().includes(needle),
        )
      : CUSTOMERS.slice();

    if (sortKey) {
      list = list.slice().sort((a, b) => {
        const result =
          sortKey === "lastOrderAt"
            ? (a.lastOrderAt ?? "").localeCompare(b.lastOrderAt ?? "")
            : a[sortKey] - b[sortKey];
        return sortDirection === "asc" ? result : -result;
      });
    }

    return list;
  }, [query, sortKey, sortDirection]);

  const columns: DataTableColumn<Customer>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (customer) => (
        <div className="flex items-center gap-3">
          <Avatar name={customer.name} src={customer.avatarUrl} size="sm" />
          <span className="font-medium text-charcoal">{customer.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (customer) => <span className="text-charcoal-soft">{customer.email}</span>,
    },
    {
      key: "orderCount",
      header: (
        <SortableColumnHeader
          label="Orders"
          active={sortKey === "orderCount"}
          direction={sortDirection}
          onClick={() => toggleSort("orderCount")}
        />
      ),
      render: (customer) => customer.orderCount,
    },
    {
      key: "lifetimeValue",
      header: (
        <SortableColumnHeader
          label="Lifetime Value"
          active={sortKey === "lifetimeValue"}
          direction={sortDirection}
          onClick={() => toggleSort("lifetimeValue")}
        />
      ),
      render: (customer) => (
        <span className="font-semibold text-charcoal">{formatPrice(customer.lifetimeValue)}</span>
      ),
    },
    {
      key: "lastOrderAt",
      header: (
        <SortableColumnHeader
          label="Last Order"
          active={sortKey === "lastOrderAt"}
          direction={sortDirection}
          onClick={() => toggleSort("lastOrderAt")}
        />
      ),
      render: (customer) => (
        <span className="text-charcoal-soft">
          {customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (customer) => (
        <div className="flex items-center gap-1.5">
          {customer.tags?.includes("VIP") && <Badge variant="gold">VIP</Badge>}
          {customer.status === "active" ? (
            <StatusBadge domain="user" status="active" />
          ) : (
            <Badge variant="danger">Blocked</Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Customers" description="View and manage your customer relationships." />

      <div className="mb-4 max-w-sm">
        <SearchInput
          placeholder="Search by name or email..."
          showShortcutHint={false}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredCustomers}
        getRowKey={(customer) => customer.id}
        onRowClick={(customer) => router.push(`/customers/${customer.id}`)}
        emptyState={<span className="text-charcoal-soft">No customers match your search.</span>}
      />
    </div>
  );
}
