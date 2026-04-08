"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  LayoutDashboardIcon,
  CpuIcon,
  ShieldCheckIcon,
  RecycleIcon,
  FileTextIcon,
} from "lucide-react";

interface PassportSectionNavProps {
  publicId: string;
}

const sections = [
  { label: "Overview", segment: "", icon: LayoutDashboardIcon },
  { label: "Specs", segment: "/specs", icon: CpuIcon },
  { label: "Compliance", segment: "/compliance", icon: ShieldCheckIcon },
  { label: "Circularity", segment: "/circularity", icon: RecycleIcon },
  { label: "Documents", segment: "/documents", icon: FileTextIcon },
];

export function PassportSectionNav({ publicId }: PassportSectionNavProps) {
  const pathname = usePathname();
  const base = `/passport/${publicId}`;

  return (
    <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <nav className="flex gap-1 py-1" role="tablist">
            {sections.map((s) => {
              const href = `${base}${s.segment}`;
              const isActive =
                s.segment === ""
                  ? pathname === base || pathname === `${base}/`
                  : pathname.startsWith(href);
              const Icon = s.icon;

              return (
                <Link
                  key={s.segment}
                  href={href}
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    "relative flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {s.label}
                </Link>
              );
            })}
          </nav>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
