"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PASSPORT_SECTIONS } from "@/lib/navigation";

interface PassportContextNavProps {
  passportId: string;
}

export function PassportContextNav({ passportId }: PassportContextNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: horizontal scrollable tab strip */}
      <nav className="lg:hidden -mx-4 border-b border-[#D9D9D9] bg-[#FAFAFA] px-4 sm:-mx-6 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {PASSPORT_SECTIONS.map((section) => {
            const href = `/app/passports/${passportId}/${section.href}`;
            const isActive = pathname === href;

            return (
              <Link
                key={section.href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "nav-pill-active text-[#0D0D0D]"
                    : "border border-transparent text-[#737373] hover:bg-[#F2F2F2] hover:text-[#0D0D0D]"
                )}
              >
                <section.icon className="h-3 w-3 shrink-0" />
                {section.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: vertical sidebar */}
      <nav className="hidden w-44 shrink-0 lg:block">
        <div className="sticky top-20 space-y-0.5">
          {PASSPORT_SECTIONS.map((section) => {
            const href = `/app/passports/${passportId}/${section.href}`;
            const isActive = pathname === href;

            return (
              <Link
                key={section.href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border-l-2 border-[#22C55E] bg-[#E8FAE9] font-medium text-[#0D0D0D]"
                    : "border-l-2 border-transparent text-[#737373] hover:bg-[#F2F2F2] hover:text-[#0D0D0D]"
                )}
              >
                <section.icon className="h-3.5 w-3.5 shrink-0" />
                {section.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
