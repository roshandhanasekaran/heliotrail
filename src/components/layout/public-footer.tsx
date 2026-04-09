import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PublicFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-[#D9D9D9] bg-[#FAFAFA]", className)}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center bg-[#22C55E] text-[#0D0D0D]">
              <span className="text-xs font-bold">HT</span>
            </div>
            <span className="text-sm text-[#737373]">
              {SITE_CONFIG.name} &mdash; Digital Product Passports for PV Solar
            </span>
          </div>
          <nav className="flex gap-4 text-sm text-[#737373]">
            <Link href="/scan" className="hover:text-[#0D0D0D] transition-colors">
              Scan Passport
            </Link>
            <Link href="/" className="hover:text-[#0D0D0D] transition-colors">
              About
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-[#737373]">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Aligned with EU
          ESPR Digital Product Passport requirements.
        </p>
      </div>
    </footer>
  );
}
