"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

interface AppTopbarProps {
  onMobileMenuToggle: () => void;
}

function getBreadcrumbs(pathname: string): string[] {
  const segments = pathname.replace("/app", "").split("/").filter(Boolean);
  if (segments.length === 0) return ["Dashboard"];
  return segments.map(
    (s) =>
      s
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function AppTopbar({ onMobileMenuToggle }: AppTopbarProps) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      {/* Left: mobile menu + breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden text-muted-foreground"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>

        <nav aria-label="Breadcrumb" className="hidden sm:block">
          <ol className="flex items-center gap-1 text-sm">
            {crumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="text-[#D9D9D9]">/</span>
                )}
                <span
                  className={
                    i === crumbs.length - 1
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {crumb}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Right: search, notifications, user */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <div className="relative mr-2 hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search passports..."
            className="h-8 w-56 border border-border bg-muted pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-[#22C55E] text-[9px] font-bold text-foreground">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
