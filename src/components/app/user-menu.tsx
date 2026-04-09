"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="flex h-6 w-6 items-center justify-center bg-muted text-xs font-bold text-muted-foreground">
          D
        </div>
        <span className="sr-only">User menu</span>
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 border border-border bg-background shadow-md">
          <div className="border-b border-border px-3 py-2">
            <p className="text-sm font-medium text-foreground">Demo User</p>
            <p className="text-xs text-muted-foreground">demo@heliotrail.com</p>
          </div>
          <div className="py-1">
            <Link
              href="/app/settings"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
