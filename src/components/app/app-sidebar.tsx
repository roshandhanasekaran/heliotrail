"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_SECTIONS } from "@/lib/navigation";
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

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {SIDEBAR_SECTIONS.map((section, si) => (
          <div key={section.title} className={si > 0 ? "mt-5" : "mt-1"}>
            {/* Section header */}
            {!collapsed && (
              <div className="mb-1 px-3 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#A3A3A3]">
                {section.title}
              </div>
            )}
            {collapsed && si > 0 && (
              <div className="mx-3 mb-2 border-t border-[#E5E5E5]" />
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group/nav relative flex items-center gap-3 px-3 py-2 text-[0.8125rem] font-medium transition-all duration-150",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "border-l-2 border-[#22C55E] bg-[#E8FAE9] text-[#0D0D0D]"
                        : "border-l-2 border-transparent text-[#737373] hover:bg-[#F2F2F2] hover:text-[#0D0D0D]"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span>{item.label}</span>}

                    {/* Badge dot for Approvals */}
                    {item.badge === "count" &&
                      item.href === "/app/approvals" && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">
                          <span className="flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping bg-[#F59E0B] opacity-75" />
                            <span className="relative inline-flex h-2 w-2 bg-[#F59E0B]" />
                          </span>
                        </span>
                      )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: Collapse + user */}
      <div className="border-t border-[#D9D9D9] p-2">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-2 px-2 py-1.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#22C55E] text-xs font-bold text-[#0D0D0D]">
              W
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#0D0D0D]">
                Waaree Energies
              </p>
              <p className="truncate text-[0.625rem] text-[#A3A3A3]">
                demo@heliotrail.com
              </p>
            </div>
          </div>
        )}
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
