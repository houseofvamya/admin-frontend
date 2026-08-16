import type { CustomerAddress } from './customer';

export interface OrderLineItem {
  productId: string;
  name: string;
  image: string;
  variant: { metal: string; size?: string };
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: { id: string; name: string; email: string; avatarUrl?: string };
  lineItems: OrderLineItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusTimeline: OrderStatusEvent[];
  shippingAddress: CustomerAddress;
  billingAddress: CustomerAddress;
  paymentMethod: string;
  placedAt: string;
  updatedAt: string;
}
