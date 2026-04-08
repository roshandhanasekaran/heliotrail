"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { GlassButton } from "@/components/ui/glass-button";
import { ArrowRightIcon } from "lucide-react";

export function CTAFooter() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a1a]">
      {/* Gradient orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
        }}
      />

      {/* No top gradient — flows directly from capabilities section */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to see it in action?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            Explore fully populated demo passports with real specifications,
            certifications, material data, and circularity information.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/passport/topcon-550-bf-2026-001">
              <GlassButton
                size="lg"
                contentClassName="flex items-center gap-2 text-white"
              >
                View TOPCon 550W Passport
                <ArrowRightIcon className="h-4 w-4" />
              </GlassButton>
            </Link>
            <Link href="/passport/perc-450-mono-2026-002">
              <GlassButton
                size="default"
                contentClassName="text-slate-300"
              >
                View PERC 450W Passport
              </GlassButton>
            </Link>
            <Link href="/passport/hjt-420-2026-003">
              <GlassButton
                size="default"
                contentClassName="text-slate-300"
              >
                View HJT 420W Passport
              </GlassButton>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
