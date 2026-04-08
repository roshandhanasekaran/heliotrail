"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { SparklesCore } from "@/components/ui/sparkles";
import { ArrowRightIcon } from "lucide-react";

export function CTAFooter() {
  return (
    <section className="relative overflow-hidden border-t border-border/50">
      <div className="absolute inset-0 z-0">
        <SparklesCore
          background="transparent"
          minSize={0.3}
          maxSize={1}
          particleDensity={40}
          className="h-full w-full"
          particleColor="#4caf50"
          speed={0.5}
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/90 to-background/70" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to see it in action?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Explore a fully populated demo passport with real specifications,
            certifications, material data, and circularity information.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/passport/topcon-550-bf-2026-001"
              className={buttonVariants({
                size: "lg",
                className:
                  "gap-2 px-6 text-base shadow-lg shadow-primary/20",
              })}
            >
              View TOPCon 550W Passport
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/passport/perc-450-mono-2026-002"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "gap-2 px-6 text-base border-primary/30",
              })}
            >
              View PERC 450W Passport
            </Link>
            <Link
              href="/passport/hjt-420-2026-003"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "gap-2 px-6 text-base border-primary/30",
              })}
            >
              View HJT 420W Passport
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
