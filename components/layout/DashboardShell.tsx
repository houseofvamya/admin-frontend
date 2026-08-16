"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export interface DashboardShellProps {
  children: React.ReactNode;
}

function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  function handleLogout() {
    try {
      window.localStorage.removeItem("vamya-admin-auth");
    } catch {
      // Ignore storage failures.
    }
    router.push("/login");
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-ivory">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} onLogout={handleLogout} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <FadeIn>{children}</FadeIn>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export { DashboardShell };
