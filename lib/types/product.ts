export type Metal = 'yellow-gold' | 'white-gold' | 'rose-gold' | 'platinum' | 'silver';

export interface ProductVariant {
  id: string;
  metal: Metal;
  size?: string;
  sku: string;
  priceOverride?: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categoryId: string;
  metal: Metal;
  gemstone?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants: ProductVariant[];
  totalStock: number;
  lowStockThreshold: number;
  status: 'active' | 'draft' | 'archived';
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: number;
  costPrice: number;
  supplier: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}
