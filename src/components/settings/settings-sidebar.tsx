"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SETTINGS_SECTIONS } from "@/lib/settings-nav";
import { hasPermission, ROLE_LABELS, type Role } from "@/lib/rbac";

interface SettingsSidebarProps {
  userRole: Role;
}

interface RoleBadgeProps {
  minRole: Role;
}

function RoleBadge({ minRole }: RoleBadgeProps) {
  if (minRole === "viewer") return null;

  const styles: Record<string, string> = {
    owner: "bg-red-100 text-red-700",
    admin: "bg-emerald-100 text-emerald-700",
    compliance: "bg-indigo-100 text-indigo-700",
  };

  const labels: Record<string, string> = {
    owner: "OWNER",
    admin: "ADMIN",
    compliance: "COMPLIANCE+",
  };

  const style = styles[minRole];
  const label = labels[minRole];

  if (!style || !label) return null;

  return (
    <span
      className={cn(
        "ml-auto shrink-0 rounded px-1 py-0.5 text-[0.5rem] font-bold uppercase leading-none tracking-wide",
        style
      )}
    >
      {label}
    </span>
  );
}

export function SettingsSidebar({ userRole }: SettingsSidebarProps) {
  const pathname = usePathname();

  // Flatten all items for mobile tab strip
  const allItems = SETTINGS_SECTIONS.flatMap((section) =>
    section.items.filter((item) => hasPermission(userRole, item.minRole))
  );

  return (
    <>
      {/* Mobile: horizontal scrollable tab strip */}
      <nav className="lg:hidden -mx-4 border-b border-border bg-muted/50 px-4 sm:-mx-6 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {allItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "nav-pill-active text-foreground"
                    : "border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-3 w-3 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: vertical sticky sidebar */}
      <nav className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-20 space-y-4">
          {SETTINGS_SECTIONS.map((section) => {
            const visibleItems = section.items.filter((item) =>
              hasPermission(userRole, item.minRole)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title}>
                <p className="mb-1 px-3 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
                          isActive
                            ? "border-l-2 border-primary bg-[var(--passport-green-muted)] font-medium text-foreground"
                            : "border-l-2 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        <RoleBadge minRole={item.minRole} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
