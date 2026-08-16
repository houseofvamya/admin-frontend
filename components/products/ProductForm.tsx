"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gem, UploadCloud, X } from "lucide-react";
import { FormSection } from "@/components/admin/FormSection";
import { VariantEditor, type ProductVariant as EditorVariant } from "@/components/admin/VariantEditor";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { CATEGORIES } from "@/lib/mock-data/categories";
import { slugify } from "@/lib/utils";
import type { Product, Metal } from "@/lib/types/product";

const METAL_LABELS: Record<Metal, string> = {
  "yellow-gold": "Yellow Gold",
  "white-gold": "White Gold",
  "rose-gold": "Rose Gold",
  platinum: "Platinum",
  silver: "Silver",
};

const METAL_OPTIONS = Object.values(METAL_LABELS);

const productFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Add a longer description (10+ characters)"),
  categoryId: z.string().min(1, "Select a category"),
  price: z.coerce.number({ invalid_type_error: "Enter a valid price" }).positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().nonnegative("Must be 0 or more").optional(),
  lowStockThreshold: z.coerce.number().int().nonnegative("Must be 0 or more"),
  status: z.enum(["active", "draft", "archived"]),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface MediaItem {
  id: string;
}

function toEditorVariant(variant: Product["variants"][number]): EditorVariant {
  return {
    id: variant.id,
    metal: METAL_LABELS[variant.metal] ?? variant.metal,
    size: variant.size ?? "",
    sku: variant.sku,
    stock: variant.stock,
  };
}

export interface ProductFormProps {
  product?: Product;
}

function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = Boolean(product);

  const [slugEditedManually, setSlugEditedManually] = React.useState(isEditMode);
  const [variants, setVariants] = React.useState<EditorVariant[]>(
    () => product?.variants.map(toEditorVariant) ?? [],
  );
  const [media, setMedia] = React.useState<MediaItem[]>(
    () => (product?.images ?? []).map((image) => ({ id: image })),
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId ?? CATEGORIES[0]?.id ?? "",
      price: product?.price ?? 0,
      compareAtPrice: product?.compareAtPrice,
      lowStockThreshold: product?.lowStockThreshold ?? 5,
      status: product?.status ?? "draft",
      isFeatured: product?.isFeatured ?? false,
      isNew: product?.isNew ?? false,
    },
  });

  const nameValue = watch("name");
  const slugField = register("slug");

  React.useEffect(() => {
    if (!slugEditedManually) {
      setValue("slug", slugify(nameValue || ""), { shouldValidate: true });
    }
  }, [nameValue, slugEditedManually, setValue]);

  const totalStock = variants.reduce(
    (sum, variant) => sum + (Number.isFinite(variant.stock) ? variant.stock : 0),
    0,
  );

  function addPlaceholderImage() {
    setMedia((current) => [...current, { id: crypto.randomUUID() }]);
  }

  function removeImage(id: string) {
    setMedia((current) => current.filter((item) => item.id !== id));
  }

  function onSubmit(values: ProductFormValues) {
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      toast({
        title: isEditMode ? "Product updated" : "Product created",
        description: `"${values.name}" has been saved.`,
        variant: "success",
      });
      router.push("/products");
    }, 600);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <FormSection title="Basic Info" description="The essentials customers see first.">
        <Input label="Product name" placeholder="e.g. Aurelia Solitaire Ring" error={errors.name?.message} {...register("name")} />
        <Input
          label="Slug"
          placeholder="aurelia-solitaire-ring"
          error={errors.slug?.message}
          helperText={!slugEditedManually ? "Auto-generated from the name — edit to override." : undefined}
          {...slugField}
          onChange={(e) => {
            setSlugEditedManually(true);
            slugField.onChange(e);
          }}
        />
        <Textarea
          label="Description"
          placeholder="Describe the craftsmanship, materials and details..."
          error={errors.description?.message}
          {...register("description")}
        />
        <Select label="Category" error={errors.categoryId?.message} {...register("categoryId")}>
          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormSection>

      <FormSection title="Media" description="Upload product photography.">
        <div
          role="button"
          tabIndex={0}
          onClick={addPlaceholderImage}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") addPlaceholderImage();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addPlaceholderImage();
          }}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line bg-cream/40 px-6 py-10 text-center transition-colors hover:border-gold hover:bg-gold-soft/10"
        >
          <UploadCloud className="size-8 text-gold-deep" strokeWidth={1.25} />
          <p className="text-sm font-medium text-charcoal">Drag and drop images here, or click to add</p>
          <p className="text-xs text-charcoal-soft">PNG or JPG — this is a visual placeholder only.</p>
        </div>

        {media.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-gold-soft/40 to-cream text-gold-deep"
              >
                <Gem className="size-6" strokeWidth={1.25} />
                <button
                  type="button"
                  onClick={() => removeImage(item.id)}
                  aria-label="Remove image"
                  className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-charcoal text-ivory opacity-0 shadow-soft transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </FormSection>

      <FormSection title="Pricing" description="Set the retail and comparison price.">
        <Input
          label="Price (USD)"
          type="number"
          min={0}
          step="0.01"
          error={errors.price?.message}
          {...register("price")}
        />
        <Input
          label="Compare-at price (USD)"
          type="number"
          min={0}
          step="0.01"
          helperText="Optional — shown as a struck-through price."
          error={errors.compareAtPrice?.message}
          {...register("compareAtPrice")}
        />
      </FormSection>

      <FormSection title="Variants" description="Metal, size and per-variant stock.">
        <VariantEditor variants={variants} onChange={setVariants} metalOptions={METAL_OPTIONS} />
      </FormSection>

      <FormSection title="Inventory" description="Stock levels and low-stock alerting.">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-charcoal">Total stock</span>
          <div className="flex h-11 items-center rounded-lg border border-line bg-cream/50 px-3.5 text-sm text-charcoal-soft">
            {totalStock} units across {variants.length} variant{variants.length === 1 ? "" : "s"}
          </div>
        </div>
        <Input
          label="Low stock threshold"
          type="number"
          min={0}
          error={errors.lowStockThreshold?.message}
          {...register("lowStockThreshold")}
        />
      </FormSection>

      <FormSection title="Status" description="Visibility and merchandising flags.">
        <Select label="Status" error={errors.status?.message} {...register("status")}>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </Select>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2.5 text-sm text-charcoal">
            <input
              type="checkbox"
              className="size-4 rounded border-line accent-gold-deep"
              {...register("isFeatured")}
            />
            Featured product
          </label>
          <label className="flex items-center gap-2.5 text-sm text-charcoal">
            <input
              type="checkbox"
              className="size-4 rounded border-line accent-gold-deep"
              {...register("isNew")}
            />
            Mark as new
          </label>
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-line bg-ivory/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-ivory/80 sm:-mx-6 sm:px-6">
        <Button type="button" variant="outline" asChild>
          <Link href="/products">Cancel</Link>
        </Button>
        <Button type="submit" isLoading={isSaving}>
          {isEditMode ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

export { ProductForm };
