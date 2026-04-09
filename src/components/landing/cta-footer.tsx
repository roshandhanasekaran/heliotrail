"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRightIcon } from "lucide-react";

export function CTAFooter() {
  return (
    <section className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to see it in action?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Explore fully populated demo passports with real specifications,
            certifications, material data, and circularity information.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/passport/topcon-550-bf-2026-001">
              <button className="cta-primary">
                <span>View TOPCon 550W Passport</span>
                <ArrowRightIcon className="arrow-icon h-4 w-4" />
              </button>
            </Link>
            <Link href="/passport/perc-450-mono-2026-002">
              <button className="cta-secondary">
                <span>View PERC 450W Passport</span>
              </button>
            </Link>
            <Link href="/passport/hjt-420-2026-003">
              <button className="cta-secondary">
                <span>View HJT 420W Passport</span>
              </button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
