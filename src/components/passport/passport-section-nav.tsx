"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PassportSectionNavProps {
  publicId: string;
}

const sections = [
  { label: "Overview", segment: "" },
  { label: "Specs", segment: "/specs" },
  { label: "Compliance", segment: "/compliance" },
  { label: "Circularity", segment: "/circularity" },
  { label: "Documents", segment: "/documents" },
];

export function PassportSectionNav({ publicId }: PassportSectionNavProps) {
  const pathname = usePathname();
  const base = `/passport/${publicId}`;

  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <nav className="flex gap-0" role="tablist">
            {sections.map((s) => {
              const href = `${base}${s.segment}`;
              const isActive =
                s.segment === ""
                  ? pathname === base || pathname === `${base}/`
                  : pathname.startsWith(href);

              return (
                <Link
                  key={s.segment}
                  href={href}
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
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
