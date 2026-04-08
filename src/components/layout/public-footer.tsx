import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="text-xs font-bold">HT</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {SITE_CONFIG.name} &mdash; Digital Product Passports for PV Solar
            </span>
          </div>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/scan" className="hover:text-foreground transition-colors">
              Scan Passport
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Aligned with EU
          ESPR Digital Product Passport requirements.
        </p>
      </div>
    </footer>
  );
}
