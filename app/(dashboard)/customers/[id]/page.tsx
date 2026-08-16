import { notFound } from "next/navigation";
import { CalendarDays, Mail, MapPin, Phone, ShoppingBag, Wallet } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CustomerOrdersTable } from "@/components/customers/CustomerOrdersTable";
import { getCustomerById } from "@/lib/mock-data/customers";
import { ORDERS } from "@/lib/mock-data/orders";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function CustomerDetailPage(props: PageProps<"/customers/[id]">) {
  const { id } = await props.params;
  const customer = getCustomerById(id);

  if (!customer) {
    notFound();
  }

  const customerOrders = ORDERS.filter(
    (order) => order.customer.id === customer.id || order.customer.email === customer.email,
  );

  const avgOrderValue = customer.orderCount > 0 ? customer.lifetimeValue / customer.orderCount : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={customer.name} description={`Customer since ${formatDate(customer.joinedAt)}`} />

      <Card variant="soft">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={customer.name} src={customer.avatarUrl} size="lg" />
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-2xl text-charcoal">{customer.name}</p>
              {customer.tags?.includes("VIP") && <Badge variant="gold">VIP</Badge>}
              {customer.status === "active" ? (
                <StatusBadge domain="user" status="active" />
              ) : (
                <Badge variant="danger">Blocked</Badge>
              )}
            </div>
            <div className="flex flex-col gap-1 text-sm text-charcoal-soft sm:flex-row sm:flex-wrap sm:gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" /> {customer.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" /> {customer.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> Joined {formatDate(customer.joinedAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card variant="flat">
          <CardContent className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft/30 text-gold-deep">
              <ShoppingBag className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal-soft">Total Orders</p>
              <p className="font-display text-2xl text-charcoal">{customer.orderCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="flat">
          <CardContent className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft/30 text-gold-deep">
              <Wallet className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal-soft">Lifetime Value</p>
              <p className="font-display text-2xl text-charcoal">{formatPrice(customer.lifetimeValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="flat">
          <CardContent className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft/30 text-gold-deep">
              <Wallet className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal-soft">Avg Order Value</p>
              <p className="font-display text-2xl text-charcoal">{formatPrice(avgOrderValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl text-charcoal">Addresses</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {customer.addresses.map((address, index) => (
            <Card key={`${address.label}-${index}`} variant="flat">
              <CardContent className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-medium text-charcoal">
                    <MapPin className="size-4 text-gold-deep" /> {address.label}
                  </span>
                  {address.isDefault && <Badge variant="gold">Default</Badge>}
                </div>
                <p className="text-sm text-charcoal-soft">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p className="text-sm text-charcoal-soft">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-charcoal-soft">{address.country}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl text-charcoal">Order History</h2>
        <CustomerOrdersTable orders={customerOrders} />
      </section>
    </div>
  );
}
