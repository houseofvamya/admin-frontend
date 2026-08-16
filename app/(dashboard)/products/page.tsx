"use client";

import * as React from "react";
import Link from "next/link";
import { Gem, LayoutGrid, List, MoreVertical, Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { SearchInput } from "@/components/admin/SearchInput";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { PRODUCTS } from "@/lib/mock-data/products";
import { CATEGORIES } from "@/lib/mock-data/categories";
import { cn, formatPrice } from "@/lib/utils";
import type { Product, Metal } from "@/lib/types/product";

const METAL_LABELS: Record<Metal, string> = {
  "yellow-gold": "Yellow Gold",
  "white-gold": "White Gold",
  "rose-gold": "Rose Gold",
  platinum: "Platinum",
  silver: "Silver",
};

type ViewMode = "grid" | "table";

function ProductActionsMenu({
  product,
  onDuplicate,
  onDelete,
}: {
  product: Product;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="size-9 p-0"
          aria-label={`Actions for ${product.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownItem asChild>
          <Link href={`/products/${product.id}`}>Edit</Link>
        </DropdownItem>
        <DropdownItem onSelect={() => onDuplicate(product)}>Duplicate</DropdownItem>
        <DropdownItem variant="danger" onSelect={() => onDelete(product)}>
          Delete
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

export default function ProductsPage() {
  const { toast } = useToast();
  const [view, setView] = React.useState<ViewMode>("grid");
  const [category, setCategory] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [metal, setMetal] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);

  const filteredProducts = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = category === "all" || product.categoryId === category;
      const matchesStatus = status === "all" || product.status === status;
      const matchesMetal = metal === "all" || product.metal === metal;
      const matchesQuery =
        normalizedQuery.length === 0 || product.name.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesStatus && matchesMetal && matchesQuery;
    });
  }, [category, status, metal, query]);

  function handleDuplicate(product: Product) {
    toast({ title: "Product duplicated", description: `"${product.name}" was duplicated.`, variant: "success" });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    toast({ title: "Product deleted", description: `"${deleteTarget.name}" was removed.`, variant: "success" });
    setDeleteTarget(null);
  }

  const columns: DataTableColumn<Product>[] = [
    {
      key: "image",
      header: "",
      className: "w-16",
      render: () => (
        <div className="flex size-11 items-center justify-center rounded-lg bg-gradient-to-br from-gold-soft/40 to-cream text-gold-deep">
          <Gem className="size-5" />
        </div>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (product) => (
        <Link href={`/products/${product.id}`} className="font-medium text-charcoal hover:underline">
          {product.name}
        </Link>
      ),
    },
    { key: "category", header: "Category", render: (product) => product.category },
    { key: "metal", header: "Metal", render: (product) => METAL_LABELS[product.metal] },
    {
      key: "price",
      header: "Price",
      render: (product) => <span className="tabular-nums">{formatPrice(product.price)}</span>,
    },
    { key: "stock", header: "Stock", render: (product) => product.totalStock },
    {
      key: "status",
      header: "Status",
      render: (product) => <StatusBadge status={product.status} domain="product" />,
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (product) => (
        <ProductActionsMenu product={product} onDuplicate={handleDuplicate} onDelete={setDeleteTarget} />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="Manage your jewellery catalog."
        actions={
          <Button asChild>
            <Link href="/products/new">
              <Plus className="size-4" />
              Add Product
            </Link>
          </Button>
        }
      />

      <FilterBar>
        <Select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:w-48"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="sm:w-40"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </Select>
        <Select
          aria-label="Filter by metal"
          value={metal}
          onChange={(e) => setMetal(e.target.value)}
          className="sm:w-44"
        >
          <option value="all">All metals</option>
          {Object.entries(METAL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <SearchInput
          placeholder="Search products..."
          showShortcutHint={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          containerClassName="sm:flex-1"
        />
        <div className="flex items-center gap-1 rounded-full border border-line bg-ivory p-1">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-colors",
              view === "grid" ? "bg-charcoal text-ivory" : "text-charcoal-soft hover:bg-cream",
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            aria-label="Table view"
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-colors",
              view === "table" ? "bg-charcoal text-ivory" : "text-charcoal-soft hover:bg-cream",
            )}
          >
            <List className="size-4" />
          </button>
        </div>
      </FilterBar>

      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          heading="No products found"
          subtext="Try adjusting your filters or search term."
        />
      ) : view === "table" ? (
        <DataTable columns={columns} data={filteredProducts} getRowKey={(product) => product.id} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} variant="soft" hoverLift className="flex flex-col overflow-hidden">
              <Link href={`/products/${product.id}`} className="flex flex-col">
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-gold-soft/40 via-cream to-ivory text-gold-deep">
                  <Gem className="size-10" strokeWidth={1.25} />
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display text-lg leading-snug text-charcoal">{product.name}</span>
                    <StatusBadge status={product.status} domain="product" />
                  </div>
                  <span className="text-sm text-charcoal-soft">{product.category}</span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-medium tabular-nums text-charcoal">{formatPrice(product.price)}</span>
                    <span className="text-xs text-charcoal-soft">{product.totalStock} in stock</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/products/${product.id}`}>Edit</Link>
                </Button>
                <ProductActionsMenu product={product} onDuplicate={handleDuplicate} onDelete={setDeleteTarget} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
