"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_SECTIONS } from "@/lib/navigation";
import { PanelLeftClose, PanelLeft, ArrowRight } from "lucide-react";
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
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-sidebar transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/app" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#22C55E] transition-opacity group-hover:opacity-80">
            <svg width="20" height="18" viewBox="2915 4335 348 303" xmlns="http://www.w3.org/2000/svg"><path d="M3233.04 4337 3224.27 4337 3162.89 4337 3162.89 4354.56 3207.75 4354.56 3112.32 4495.95 3009.99 4426.29 3003.38 4421.8 2998.3 4427.96 2915 4528.9 2928.52 4540.08 3006.73 4445.31 3109.73 4515.42 3117 4520.37 3121.93 4513.07 3215.5 4374.45 3215.5 4416 3233.04 4416 3233.04 4337Z" fill="#FFFFFF" fillRule="evenodd"/><path d="M3262.93 4586.54 3256.47 4580.66 3253.96 4578.38 3208.24 4536.78 3196.44 4549.76 3227.89 4578.38 3135.09 4578.38 3036.58 4505.49 3030.05 4500.66 3024.73 4506.8 2967.74 4572.63 2981 4584.13 3032.67 4524.43 3126.99 4594.22 3129.31 4595.93 3132.2 4595.93 3230.88 4595.93 3204.6 4625.17 3217.63 4636.92 3254.47 4595.93 3257.09 4593.03 3262.93 4586.54Z" fill="#FFFFFF" fillRule="evenodd"/></svg>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground">
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
              <div className="mb-1 px-3 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
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
                        ? "border-l-2 border-[#22C55E] bg-[#E8FAE9] dark:bg-[#22C55E]/10 text-foreground"
                        : "border-l-2 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
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

      {/* Fleet Health mini-widget */}
      {!collapsed && (
        <div className="mx-2 mb-2">
          <div className="mb-1 px-3 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Fleet Health
          </div>
          <div className="dashed-card p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                <span className="h-1.5 w-1.5 bg-[#22C55E]" />
                Fleet PR
              </span>
              <span className="font-mono text-[0.6875rem] font-semibold text-foreground">
                81.4%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                <span className="h-1.5 w-1.5 bg-[#22C55E]" />
                Avg Degradation
              </span>
              <span className="font-mono text-[0.6875rem] font-semibold text-foreground">
                0.41%/yr
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                <span className="h-1.5 w-1.5 bg-[#F59E0B]" />
                Alerts
              </span>
              <span className="font-mono text-[0.6875rem] font-semibold text-[#F59E0B]">
                2 active
              </span>
            </div>
            <Link
              href="/app/analytics"
              className="flex items-center gap-1 pt-1 text-[0.625rem] font-medium text-[#22C55E] transition-colors hover:text-foreground"
            >
              View Details <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Bottom: Collapse + user */}
      <div className="border-t border-border p-2">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-2 px-2 py-1.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#22C55E] text-xs font-bold text-foreground">
              R
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">
                Roshan
              </p>
              <p className="truncate text-[0.625rem] text-muted-foreground">
                demo@heliotrail.com
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
