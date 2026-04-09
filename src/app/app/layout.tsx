"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar
            collapsed={false}
            onToggle={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-200",
          collapsed ? "lg:ml-16" : "lg:ml-60"
        )}
      >
        <AppTopbar onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 bg-white p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
