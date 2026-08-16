"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Gem,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Tags,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarState } from "@/hooks/useSidebarState";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/products", icon: Gem },
      { label: "Categories", href: "/categories", icon: Tags },
      { label: "Inventory", href: "/inventory", icon: Boxes },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/orders", icon: ShoppingBag },
      { label: "Customers", href: "/customers", icon: Users },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users", href: "/users", icon: UserCog },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "border-gold bg-gold-soft/25 text-gold-deep"
          : "text-charcoal-soft hover:bg-cream hover:text-charcoal",
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarContent({
  collapsed,
  onNavigate,
  onCloseMobile,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onCloseMobile?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-line",
          collapsed ? "justify-center px-2" : "justify-between px-5",
        )}
      >
        {collapsed ? (
          <span className="font-display text-xl text-gold-deep">HV</span>
        ) : (
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl text-charcoal">House of Vamya</span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal-soft">
              Admin
            </span>
          </div>
        )}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-full p-1.5 text-charcoal-soft transition-colors hover:bg-cream lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="flex flex-col gap-1">
              {!collapsed && (
                <span className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-soft/70">
                  {section.label}
                </span>
              )}
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} collapsed={collapsed} onNavigate={onNavigate} />
              ))}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

export interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { collapsed, toggleCollapsed } = useSidebarState();

  return (
    <TooltipProvider delayDuration={200}>
      {/* Desktop persistent rail */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-line bg-ivory transition-[width] duration-300 ease-luxury lg:flex lg:flex-col",
          collapsed ? "lg:w-[72px]" : "lg:w-64",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <SidebarContent collapsed={collapsed} />
        </div>
        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-t border-line px-5 text-sm font-medium text-charcoal-soft transition-colors hover:bg-cream hover:text-charcoal",
            collapsed && "justify-center px-0",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : (
            <>
              <ChevronLeft className="size-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </aside>

      {/* Mobile off-canvas drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "" : "pointer-events-none")}>
        <div
          onClick={onMobileClose}
          className={cn(
            "absolute inset-0 bg-charcoal/50 transition-opacity duration-300 ease-luxury",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-ivory shadow-elevated transition-transform duration-300 ease-luxury",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          onKeyDown={(event) => {
            if (event.key === "Escape") onMobileClose();
          }}
        >
          <SidebarContent collapsed={false} onNavigate={onMobileClose} onCloseMobile={onMobileClose} />
        </div>
      </div>
    </TooltipProvider>
  );
}

export { Sidebar };
