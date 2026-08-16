"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { cn } from "@/lib/utils";

const SETTINGS_TABS = [
  { href: "/settings/store", label: "Store" },
  { href: "/settings/shipping", label: "Shipping" },
  { href: "/settings/payments", label: "Payments" },
  { href: "/settings/notifications", label: "Notifications" },
] as const;

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  const pathname = usePathname();

  return (
    <div>
      <PageHeader title="Settings" description="Manage your store configuration and preferences." />

      <nav className="mb-8 flex items-center gap-1 overflow-x-auto border-b border-line">
        {SETTINGS_TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative -mb-px inline-flex items-center whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                isActive
                  ? "border-gold text-gold-deep"
                  : "border-transparent text-charcoal-soft hover:text-charcoal",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
