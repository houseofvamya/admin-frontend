"use client";

import * as React from "react";
import { ChevronRight, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { CategoryFormModal } from "@/components/categories/CategoryFormModal";
import { CATEGORIES } from "@/lib/mock-data/categories";
import type { Category } from "@/lib/types/category";
import { cn } from "@/lib/utils";

const SWATCH_GRADIENTS = [
  "from-gold-soft to-gold-deep",
  "from-charcoal-soft to-charcoal",
  "from-gold to-gold-deep",
  "from-gold-soft to-charcoal-soft",
];

function swatchGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return SWATCH_GRADIENTS[hash % SWATCH_GRADIENTS.length];
}

function CategoryStatusPill({ status }: { status: Category["status"] }) {
  return (
    <Badge variant={status === "active" ? "success" : "neutral"}>
      {status === "active" ? "Active" : "Hidden"}
    </Badge>
  );
}

function CategoriesPageContent() {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<Category[]>(CATEGORIES);
  const [expanded, setExpanded] = React.useState<Set<string>>(
    () => new Set(categories.filter((category) => !category.parentId).map((category) => category.id)),
  );
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null);

  const topLevelCategories = React.useMemo(
    () =>
      categories
        .filter((category) => !category.parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const childrenOf = React.useCallback(
    (parentId: string) =>
      categories
        .filter((category) => category.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function openCreateModal() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setCategories((prev) =>
      prev.filter((category) => category.id !== deleteTarget.id && category.parentId !== deleteTarget.id),
    );
    toast({
      title: "Category deleted",
      description: `"${deleteTarget.name}" has been removed from your catalogue.`,
      variant: "success",
    });
    setDeleteTarget(null);
  }

  function renderRow(category: Category, isChild: boolean) {
    const kids = isChild ? [] : childrenOf(category.id);
    const hasKids = kids.length > 0;
    const isExpanded = expanded.has(category.id);

    return (
      <div key={category.id}>
        <div
          className={cn(
            "flex items-center gap-3 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-cream/40",
            isChild && "bg-cream/20 pl-12",
          )}
        >
          {!isChild && (
            <span className="flex size-6 shrink-0 items-center justify-center">
              {hasKids ? (
                <button
                  type="button"
                  onClick={() => toggleExpand(category.id)}
                  className="flex size-6 items-center justify-center rounded-full text-charcoal-soft transition-colors hover:bg-cream hover:text-charcoal"
                  aria-label={isExpanded ? `Collapse ${category.name}` : `Expand ${category.name}`}
                >
                  <ChevronRight
                    className={cn("size-4 transition-transform duration-200 ease-luxury", isExpanded && "rotate-90")}
                  />
                </button>
              ) : null}
            </span>
          )}

          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-ivory shadow-soft",
              swatchGradient(category.id),
            )}
          >
            <Tag className="size-4" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base text-charcoal">{category.name}</p>
            <p className="truncate text-xs text-charcoal-soft">/{category.slug}</p>
          </div>

          <div className="hidden w-48 shrink-0 sm:block">
            {category.productCount > 0 ? (
              <span className="text-sm text-charcoal-soft">{category.productCount} products</span>
            ) : (
              <span className="text-xs italic text-charcoal-soft/70">No products in this category yet</span>
            )}
          </div>

          <div className="w-20 shrink-0">
            <CategoryStatusPill status={category.status} />
          </div>

          <div className="flex w-16 shrink-0 items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => openEditModal(category)}
              className="flex size-8 items-center justify-center rounded-full text-charcoal-soft transition-colors hover:bg-cream hover:text-charcoal"
              aria-label={`Edit ${category.name}`}
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(category)}
              className="flex size-8 items-center justify-center rounded-full text-charcoal-soft transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={`Delete ${category.name}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        {!isChild && hasKids && isExpanded && kids.map((child) => renderRow(child, true))}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your catalogue into collections customers can browse."
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="size-4" />
            Add Category
          </Button>
        }
      />

      {topLevelCategories.length === 0 ? (
        <EmptyState
          icon={Tag}
          heading="No categories yet"
          subtext="Create your first category to start organizing products."
          action={<Button onClick={openCreateModal}>Add Category</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-ivory shadow-soft">
          <div className="hidden items-center gap-3 border-b border-line bg-cream/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-charcoal-soft sm:flex">
            <span className="w-6" />
            <span className="w-10" />
            <span className="flex-1">Category</span>
            <span className="w-48">Products</span>
            <span className="w-20">Status</span>
            <span className="w-16 text-right">Actions</span>
          </div>
          {topLevelCategories.map((category) => renderRow(category, false))}
        </div>
      )}

      <CategoryFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        parentOptions={topLevelCategories.filter((category) => category.id !== editingCategory?.id)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name ?? ""}"?`}
        description={
          deleteTarget && childrenOf(deleteTarget.id).length > 0
            ? "This will also remove its subcategories. This action cannot be undone."
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <ToastProvider>
      <CategoriesPageContent />
    </ToastProvider>
  );
}
