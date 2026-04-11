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
  AnchorIcon,
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
  { label: "Registry", segment: "/registry", icon: AnchorIcon },
];

export function PassportSectionNav({ publicId }: PassportSectionNavProps) {
  const pathname = usePathname();
  const base = `/passport/${publicId}`;

  return (
    <div className="sticky top-0 z-30 clean-nav">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <nav className="flex gap-1 py-2" role="tablist">
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
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "nav-pill-active text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span>{s.label}</span>
                  </div>
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
