import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { getProductById } from "@/lib/mock-data/products";

export default async function EditProductPage(props: PageProps<"/products/[id]">) {
  const { id } = await props.params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/products"
        className="flex w-fit items-center gap-1 text-sm font-medium text-charcoal-soft hover:text-charcoal"
      >
        <ChevronLeft className="size-4" />
        Back to Products
      </Link>
      <PageHeader title={product.name} description="Update product details, media and inventory." />
      <ProductForm product={product} />
    </div>
  );
}
