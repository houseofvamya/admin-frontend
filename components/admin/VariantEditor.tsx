"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export interface ProductVariant {
  id: string;
  metal: string;
  size: string;
  sku: string;
  stock: number;
}

export interface VariantEditorProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  metalOptions?: string[];
}

const DEFAULT_METAL_OPTIONS = ["Yellow Gold", "White Gold", "Rose Gold", "Platinum", "Silver"];

function createEmptyVariant(): ProductVariant {
  return {
    id: crypto.randomUUID(),
    metal: DEFAULT_METAL_OPTIONS[0]!,
    size: "",
    sku: "",
    stock: 0,
  };
}

function VariantEditor({ variants, onChange, metalOptions = DEFAULT_METAL_OPTIONS }: VariantEditorProps) {
  function updateVariant(id: string, patch: Partial<ProductVariant>) {
    onChange(variants.map((variant) => (variant.id === id ? { ...variant, ...patch } : variant)));
  }

  function removeVariant(id: string) {
    onChange(variants.filter((variant) => variant.id !== id));
  }

  function addVariant() {
    onChange([...variants, createEmptyVariant()]);
  }

  return (
    <div className="flex flex-col gap-3">
      {variants.length > 0 && (
        <div className="hidden grid-cols-[1.2fr_0.8fr_1fr_0.7fr_auto] gap-3 px-1 text-xs font-semibold uppercase tracking-wide text-charcoal-soft md:grid">
          <span>Metal</span>
          <span>Size</span>
          <span>SKU</span>
          <span>Stock</span>
          <span className="sr-only">Actions</span>
        </div>
      )}

      {variants.map((variant) => (
        <div
          key={variant.id}
          className="grid grid-cols-1 items-start gap-3 rounded-xl border border-line p-3 md:grid-cols-[1.2fr_0.8fr_1fr_0.7fr_auto] md:items-center md:border-0 md:p-0"
        >
          <Select
            aria-label="Metal"
            value={variant.metal}
            onChange={(e) => updateVariant(variant.id, { metal: e.target.value })}
          >
            {metalOptions.map((metal) => (
              <option key={metal} value={metal}>
                {metal}
              </option>
            ))}
          </Select>

          <Input
            aria-label="Size"
            placeholder="Size"
            value={variant.size}
            onChange={(e) => updateVariant(variant.id, { size: e.target.value })}
          />

          <Input
            aria-label="SKU"
            placeholder="SKU"
            value={variant.sku}
            onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
          />

          <Input
            aria-label="Stock"
            type="number"
            min={0}
            placeholder="Stock"
            value={variant.stock}
            onChange={(e) => updateVariant(variant.id, { stock: Number(e.target.value) })}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="justify-self-start text-charcoal-soft hover:bg-red-50 hover:text-red-600 md:justify-self-center"
            onClick={() => removeVariant(variant.id)}
            aria-label="Remove variant"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addVariant} className="self-start">
        <Plus className="size-4" />
        Add Variant
      </Button>
    </div>
  );
}

export { VariantEditor };
