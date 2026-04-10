"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { SunIcon, MoonIcon, ScanLineIcon, LogInIcon } from "lucide-react";

export function PublicNav() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center bg-[#22C55E] transition-opacity group-hover:opacity-80">
            <svg width="20" height="18" viewBox="2915 4335 348 303" xmlns="http://www.w3.org/2000/svg"><path d="M3233.04 4337 3224.27 4337 3162.89 4337 3162.89 4354.56 3207.75 4354.56 3112.32 4495.95 3009.99 4426.29 3003.38 4421.8 2998.3 4427.96 2915 4528.9 2928.52 4540.08 3006.73 4445.31 3109.73 4515.42 3117 4520.37 3121.93 4513.07 3215.5 4374.45 3215.5 4416 3233.04 4416 3233.04 4337Z" fill="#FFFFFF" fillRule="evenodd"/><path d="M3262.93 4586.54 3256.47 4580.66 3253.96 4578.38 3208.24 4536.78 3196.44 4549.76 3227.89 4578.38 3135.09 4578.38 3036.58 4505.49 3030.05 4500.66 3024.73 4506.8 2967.74 4572.63 2981 4584.13 3032.67 4524.43 3126.99 4594.22 3129.31 4595.93 3132.2 4595.93 3230.88 4595.93 3204.6 4625.17 3217.63 4636.92 3254.47 4595.93 3257.09 4593.03 3262.93 4586.54Z" fill="#FFFFFF" fillRule="evenodd"/></svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">HelioTrail</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/scan"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "gap-1.5 text-[#737373] hover:text-foreground",
            })}
          >
            <ScanLineIcon className="h-4 w-4" />
            Scan
          </Link>
          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "gap-1.5 text-[#737373] hover:text-foreground",
            })}
          >
            <LogInIcon className="h-4 w-4" />
            Sign In
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#737373] hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
