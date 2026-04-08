"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
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
  { label: "Overview", segment: "", icon: LayoutDashboardIcon, color: "#3b82f6" },
  { label: "Specs", segment: "/specs", icon: CpuIcon, color: "#22c55e" },
  { label: "Compliance", segment: "/compliance", icon: ShieldCheckIcon, color: "#eab308" },
  { label: "Circularity", segment: "/circularity", icon: RecycleIcon, color: "#ef4444" },
  { label: "Documents", segment: "/documents", icon: FileTextIcon, color: "#a855f7" },
];

export function PassportSectionNav({ publicId }: PassportSectionNavProps) {
  const pathname = usePathname();
  const base = `/passport/${publicId}`;

  return (
    <div className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <nav className="flex gap-0" role="tablist">
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
                    "relative flex items-center gap-2 whitespace-nowrap px-5 py-3.5 text-sm font-medium transition-all",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground/60 hover:text-muted-foreground"
                  )}
                >
                  <Icon
                    className="h-3.5 w-3.5"
                    style={isActive ? { color: s.color } : undefined}
                  />
                  {s.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{
                        backgroundColor: s.color,
                        boxShadow: `0 0 8px ${s.color}60`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
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
