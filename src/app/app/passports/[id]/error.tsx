"use client";
import { ErrorFallback } from "@/components/shared/error-fallback";

export default function PassportDetailError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Passport failed to load" backHref="/app/passports" backLabel="Back to Passports" />;
}
