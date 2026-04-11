"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

interface AppTopbarProps {
  onMobileMenuToggle: () => void;
  notificationCount?: number;
  /** Model name to show in breadcrumbs instead of UUID (set by passport detail layout) */
  passportLabel?: string;
}

function getBreadcrumbs(pathname: string, passportLabel?: string): string[] {
  const segments = pathname.replace("/app", "").split("/").filter(Boolean);
  if (segments.length === 0) return ["Dashboard"];
  return segments.map((s, i) => {
    // If this segment looks like a UUID and we have a label, use the label
    if (passportLabel && /^[0-9a-f]{8}-/.test(s)) return passportLabel;
    return s
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  });
}

export function AppTopbar({ onMobileMenuToggle, notificationCount, passportLabel }: AppTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const crumbs = getBreadcrumbs(pathname, passportLabel);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/app/passports?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

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
                  <span className="text-border">/</span>
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
            aria-label="Search passports"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="h-8 w-56 border border-border bg-muted pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {notificationCount != null && notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-primary text-[9px] font-bold text-foreground">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
