import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusTimeline, type StatusTimelineStep } from "@/components/admin/StatusTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { UpdateStatusControl } from "@/components/orders/UpdateStatusControl";
import { getOrderById } from "@/lib/mock-data/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types/order";

const STATUS_SEQUENCE: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

function buildTimelineSteps(order: NonNullable<ReturnType<typeof getOrderById>>): StatusTimelineStep[] {
  if (order.status === "cancelled") {
    return order.statusTimeline.map((event) => ({
      status: event.status,
      label: event.status.charAt(0).toUpperCase() + event.status.slice(1),
      timestamp: formatDate(event.timestamp),
      completed: true,
    }));
  }

  return STATUS_SEQUENCE.map((status) => {
    const event = order.statusTimeline.find((item) => item.status === status);
    return {
      status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      timestamp: event ? formatDate(event.timestamp) : undefined,
      completed: Boolean(event),
    };
  });
}

export default async function OrderDetailPage(props: PageProps<"/orders/[id]">) {
  const { id } = await props.params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  const timelineSteps = buildTimelineSteps(order);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/orders"
          className="flex w-fit items-center gap-1 text-sm font-medium text-charcoal-soft hover:text-charcoal"
        >
          <ChevronLeft className="size-4" />
          Back to Orders
        </Link>
        <PageHeader
          title={order.orderNumber}
          description={`Placed on ${formatDate(order.placedAt)}`}
          actions={<StatusBadge status={order.status} domain="order" className="text-sm" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card variant="flat">
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.lineItems.map((item) => (
                    <TableRow key={`${item.productId}-${item.sku}`}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-charcoal-soft">
                        {item.variant.metal}
                        {item.variant.size ? ` · ${item.variant.size}` : ""}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="tabular-nums">{formatPrice(item.unitPrice)}</TableCell>
                      <TableCell className="tabular-nums">{formatPrice(item.lineTotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card variant="flat">
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar name={order.customer.name} src={order.customer.avatarUrl} size="lg" />
                <div className="flex flex-col">
                  <span className="font-medium text-charcoal">{order.customer.name}</span>
                  <span className="text-sm text-charcoal-soft">{order.customer.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="flat">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0.5 text-sm text-charcoal">
              <span className="font-medium">{order.shippingAddress.label}</span>
              <span>{order.shippingAddress.line1}</span>
              {order.shippingAddress.line2 && <span>{order.shippingAddress.line2}</span>}
              <span>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </span>
              <span>{order.shippingAddress.country}</span>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card variant="soft">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-soft">Subtotal</span>
                <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-soft">Shipping</span>
                <span className="tabular-nums">
                  {order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-soft">Tax</span>
                <span className="tabular-nums">{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2 text-base font-semibold text-charcoal">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(order.total)}</span>
              </div>
              <p className="pt-2 text-xs text-charcoal-soft">Paid via {order.paymentMethod}</p>
            </CardContent>
          </Card>

          <Card variant="flat">
            <CardHeader>
              <CardTitle>Fulfillment</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline steps={timelineSteps} />
            </CardContent>
          </Card>

          <Card variant="flat">
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateStatusControl orderNumber={order.orderNumber} currentStatus={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
