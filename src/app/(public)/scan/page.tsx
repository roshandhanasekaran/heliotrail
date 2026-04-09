"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanLineIcon, SearchIcon } from "lucide-react";

export default function ScanPage() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Please enter a passport ID to look up.");
      return;
    }
    setError("");
    router.push(`/passport/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex items-center justify-center px-4 py-24">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ScanLineIcon className="h-6 w-6" />
          </div>
          <CardTitle className="font-heading text-xl">
            Look Up a Passport
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter a public passport ID to view its digital product passport.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="e.g. topcon-550-bf-2026-001"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="font-mono text-sm"
              />
              {error && (
                <p className="mt-1.5 text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              <SearchIcon className="mr-2 h-4 w-4" />
              View Passport
            </Button>
          </form>
          <div className="mt-6 space-y-1 text-center text-xs text-muted-foreground">
            <p>Try a demo passport:</p>
            <p className="font-mono">topcon-550-bf-2026-001</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
