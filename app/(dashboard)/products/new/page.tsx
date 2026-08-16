"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/products"
        className="flex w-fit items-center gap-1 text-sm font-medium text-charcoal-soft hover:text-charcoal"
      >
        <ChevronLeft className="size-4" />
        Back to Products
      </Link>
      <PageHeader title="Add Product" description="Create a new listing in the catalog." />
      <ProductForm />
    </div>
  );
}
