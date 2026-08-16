export interface CustomerAddress {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  joinedAt: string;
  addresses: CustomerAddress[];
  orderCount: number;
  lifetimeValue: number;
  lastOrderAt?: string;
  tags?: string[];
  status: 'active' | 'blocked';
}
