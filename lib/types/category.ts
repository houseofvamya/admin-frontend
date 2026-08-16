export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string;
  productCount: number;
  status: 'active' | 'hidden';
  sortOrder: number;
}
