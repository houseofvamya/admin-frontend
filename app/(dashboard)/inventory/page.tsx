"use client";

import * as React from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { SearchInput } from "@/components/admin/SearchInput";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/mock-data/products";
import { RestockModal, type RestockTarget } from "@/components/inventory/RestockModal";

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
type StatusFilter = "all" | "low" | "out";

interface InventoryRow {
  productId: string;
  productName: string;
  category: string;
  variantId: string;
  metal: string;
  size?: string;
  sku: string;
  baseStock: number;
  lowStockThreshold: number;
}

const INVENTORY_ROWS: InventoryRow[] = PRODUCTS.flatMap((product) =>
  product.variants.map((variant) => ({
    productId: product.id,
    productName: product.name,
    category: product.category,
    variantId: variant.id,
    metal: variant.metal,
    size: variant.size,
    sku: variant.sku,
    baseStock: variant.stock,
    lowStockThreshold: product.lowStockThreshold,
  })),
);

const CATEGORIES = Array.from(new Set(INVENTORY_ROWS.map((row) => row.category))).sort();

function formatMetal(metal: string) {
  return metal
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStockStatus(stock: number, threshold: number): StockStatus {
  if (stock === 0) return "out-of-stock";
  if (stock <= threshold) return "low-stock";
  return "in-stock";
}

export default function InventoryPage() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [stockOverrides, setStockOverrides] = React.useState<Record<string, number>>({});
  const [restockTarget, setRestockTarget] = React.useState<RestockTarget | null>(null);

  const rows = React.useMemo(
    () =>
      INVENTORY_ROWS.map((row) => ({
        ...row,
        stock: stockOverrides[row.variantId] ?? row.baseStock,
      })),
    [stockOverrides],
  );

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const status = getStockStatus(row.stock, row.lowStockThreshold);
      if (statusFilter === "low" && status !== "low-stock") return false;
      if (statusFilter === "out" && status !== "out-of-stock") return false;
      if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
      if (query && !row.productName.toLowerCase().includes(query) && !row.sku.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  }, [rows, statusFilter, categoryFilter, search]);

  function handleRestockSubmit(variantId: string, quantity: number, note: string) {
    const row = rows.find((item) => item.variantId === variantId);
    if (!row) return;
    setStockOverrides((prev) => ({ ...prev, [variantId]: row.stock + quantity }));
    toast({
      title: "Stock updated",
      description: note
        ? `Added ${quantity} units to ${row.sku}. Note: ${note}`
        : `Added ${quantity} units to ${row.sku}.`,
      variant: "success",
    });
  }

  return (
    <div>
      <PageHeader title="Inventory" description="Monitor stock levels across every product variant." />

      <FilterBar className="mb-6">
        <SearchInput
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          containerClassName="sm:max-w-xs"
          showShortcutHint={false}
        />
        <Select
          aria-label="Stock status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          containerClassName="sm:w-44"
        >
          <option value="all">All stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </Select>
        <Select
          aria-label="Category"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          containerClassName="sm:w-48"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </FilterBar>

      {filteredRows.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          heading="No inventory matches your filters"
          subtext="Try adjusting the search term or filters to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Product</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row) => {
              const status = getStockStatus(row.stock, row.lowStockThreshold);
              const isLow = status === "low-stock";
              const isOut = status === "out-of-stock";

              return (
                <TableRow
                  key={row.variantId}
                  className={cn(isLow && "border-l-2 border-l-amber-400 bg-amber-50/60 hover:bg-amber-50")}
                >
                  <TableCell className="font-medium text-charcoal">{row.productName}</TableCell>
                  <TableCell className="text-charcoal-soft">
                    {formatMetal(row.metal)}
                    {row.size ? ` · ${row.size}` : ""}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-charcoal-soft">{row.sku}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-semibold",
                        isOut ? "text-red-600" : isLow ? "text-amber-700" : "text-charcoal",
                      )}
                    >
                      {row.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-charcoal-soft">{row.lowStockThreshold}</TableCell>
                  <TableCell>
                    <StatusBadge domain="stock" status={status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setRestockTarget({
                          variantId: row.variantId,
                          productName: row.productName,
                          sku: row.sku,
                          currentStock: row.stock,
                        })
                      }
                    >
                      Restock
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <RestockModal
        target={restockTarget}
        onOpenChange={(open) => {
          if (!open) setRestockTarget(null);
        }}
        onSubmit={handleRestockSubmit}
      />
    </div>
  );
}
