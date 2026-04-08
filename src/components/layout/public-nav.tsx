"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { SunIcon, MoonIcon, ScanLineIcon, LogInIcon } from "lucide-react";

export function PublicNav() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-shadow group-hover:shadow-primary/40">
            <span className="text-sm font-bold">HT</span>
          </div>
          <span className="text-lg font-bold tracking-tight">HelioTrail</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/scan"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "gap-1.5 text-muted-foreground hover:text-foreground",
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
              className: "gap-1.5 text-muted-foreground hover:text-foreground",
            })}
          >
            <LogInIcon className="h-4 w-4" />
            Sign In
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
