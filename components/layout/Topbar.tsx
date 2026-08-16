"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  User,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { SearchInput } from "@/components/admin/SearchInput";
import { ADMIN_USERS } from "@/lib/mock-data/users";

const CURRENT_USER = ADMIN_USERS[0]!;

interface MockNotification {
  id: string;
  icon: LucideIcon;
  message: string;
  time: string;
}

const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n1",
    icon: ShoppingBag,
    message: "New order #VM-10482 was placed.",
    time: "2h ago",
  },
  {
    id: "n2",
    icon: Package,
    message: "Inventory for 'Aurelia Ring' is running low.",
    time: "5h ago",
  },
  {
    id: "n3",
    icon: UserPlus,
    message: "Camille Dubois accepted her team invite.",
    time: "1d ago",
  },
  {
    id: "n4",
    icon: AlertCircle,
    message: "Payment failed for order #VM-10391.",
    time: "2d ago",
  },
];

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return <span className="font-display text-lg text-charcoal">Dashboard</span>;
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm sm:flex">
      <Link href="/" className="text-charcoal-soft transition-colors hover:text-charcoal">
        Dashboard
      </Link>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        const href = `/${segments.slice(0, index + 1).join("/")}`;

        return (
          <React.Fragment key={href}>
            <span className="text-charcoal-soft/50">/</span>
            {isLast ? (
              <span className="font-semibold text-charcoal">{label}</span>
            ) : (
              <Link href={href} className="text-charcoal-soft transition-colors hover:text-charcoal">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export interface TopbarProps {
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

function Topbar({ onOpenMobileMenu, onLogout }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-line bg-ivory px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-charcoal-soft transition-colors hover:bg-cream lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <Breadcrumbs />

      <div className="ml-auto flex flex-1 items-center justify-end gap-3 sm:ml-0 sm:flex-none sm:gap-4 lg:ml-6 lg:flex-1 lg:justify-start">
        <SearchInput containerClassName="hidden max-w-xs md:block" />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Dropdown>
          <DropdownTrigger asChild>
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-full text-charcoal-soft transition-colors hover:bg-cream"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-gold" />
            </button>
          </DropdownTrigger>
          <DropdownContent align="end" className="w-80">
            <DropdownLabel>Notifications</DropdownLabel>
            <DropdownSeparator />
            {MOCK_NOTIFICATIONS.map((notification) => {
              const Icon = notification.icon;
              return (
                <div key={notification.id} className="flex items-start gap-3 rounded-lg px-2.5 py-2">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-soft/30 text-gold-deep">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-charcoal">{notification.message}</span>
                    <span className="text-xs text-charcoal-soft">{notification.time}</span>
                  </div>
                </div>
              );
            })}
          </DropdownContent>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-cream",
              )}
            >
              <Avatar name={CURRENT_USER.name} src={CURRENT_USER.avatarUrl} size="sm" />
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-sm font-medium text-charcoal">{CURRENT_USER.name}</span>
              </span>
              <Badge variant="gold" className="hidden capitalize sm:inline-flex">
                {CURRENT_USER.role}
              </Badge>
              <ChevronDown className="size-4 text-charcoal-soft" />
            </button>
          </DropdownTrigger>
          <DropdownContent align="end" className="w-56">
            <DropdownLabel>{CURRENT_USER.email}</DropdownLabel>
            <DropdownSeparator />
            <DropdownItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="size-4" />
                Profile
              </Link>
            </DropdownItem>
            <DropdownItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem variant="danger" onSelect={onLogout} className="flex items-center gap-2">
              <LogOut className="size-4" />
              Logout
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  );
}

export { Topbar };
