"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GLOBAL_NAV } from "@/lib/navigation";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[#D9D9D9] bg-[#FAFAFA] transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[#D9D9D9] px-4">
        <Link href="/app" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#22C55E] text-[#0D0D0D] transition-opacity group-hover:opacity-80">
            <span className="text-sm font-bold">HT</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-[#0D0D0D]">
              HelioTrail
            </span>
          )}
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 px-2 py-3">
        {GLOBAL_NAV.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "border-l-2 border-[#22C55E] bg-[#E8FAE9] text-[#0D0D0D]"
                  : "border-l-2 border-transparent text-[#737373] hover:bg-[#F2F2F2] hover:text-[#0D0D0D]"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-[#D9D9D9] p-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#737373] hover:text-[#0D0D0D]"
          onClick={onToggle}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
          <span className="sr-only">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>
      </div>
    </aside>
  );
}
