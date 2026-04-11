"use client";

import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  backHref?: string;
  backLabel?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  backHref = "/app",
  backLabel = "Back to Dashboard",
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="clean-card mx-auto max-w-md p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <h2 className="text-lg font-bold text-foreground">{title}</h2>

        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. This has been logged. You can try again
          or return to a safe page.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <pre className="mt-2 max-h-24 overflow-auto bg-muted p-3 text-left font-mono text-xs text-muted-foreground">
            {error.message}
          </pre>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="default" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Try Again
          </Button>
          <a
            href={backHref}
            className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            {backLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
