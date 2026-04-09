"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { GreenMosaic } from "@/components/landing/green-mosaic";
import {
  ArrowRightIcon,
  ScanLineIcon,
  RecycleIcon,
  ZapIcon,
  ShieldCheckIcon,
} from "lucide-react";

const stats = [
  { value: "92", suffix: "%", label: "Recyclability Rate", icon: RecycleIcon },
  { value: "385", suffix: "kg", label: "CO\u2082e / Module", icon: ZapIcon },
  {
    value: "35",
    suffix: "yr",
    label: "Expected Lifetime",
    icon: ShieldCheckIcon,
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <GreenMosaic />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 border border-[#D9D9D9] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#737373]">
              <span className="inline-flex h-2 w-2 bg-[#22C55E]" />
              EU ESPR Digital Product Passport Platform
            </div>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={0.1}>
            <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight text-[#0D0D0D] sm:text-6xl lg:text-7xl">
              The Digital Identity of{" "}
              <span className="text-[#22C55E]">Every Solar Panel</span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#737373]">
              Full lifecycle traceability — from raw materials to end-of-life
              recycling. Compliance, carbon footprint, and circularity data in
              one immutable digital passport.
            </p>
          </FadeIn>

          {/* Dual CTA buttons */}
          <FadeIn delay={0.2}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/passport/topcon-550-bf-2026-001">
                <button className="cta-primary">
                  <span>Explore Demo Passport</span>
                  <ArrowRightIcon className="arrow-icon h-4 w-4" />
                </button>
              </Link>
              <Link href="/scan">
                <button className="cta-secondary">
                  <span className="flex items-center gap-2">
                    <ScanLineIcon className="h-4 w-4" />
                    Scan QR Code
                  </span>
                </button>
              </Link>
            </div>
          </FadeIn>

          {/* Stats bar */}
          <FadeIn delay={0.25}>
            <div className="mt-20 grid grid-cols-3 gap-4 sm:gap-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-dashed border-[#D9D9D9] px-4 py-3 text-center transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <stat.icon className="h-3 w-3 text-[#737373]" />
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                      {stat.label}
                    </p>
                  </div>
                  <div className="mt-1 flex items-baseline justify-center gap-0.5">
                    <span className="text-3xl font-bold tabular-nums tracking-tight text-[#0D0D0D] sm:text-4xl">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-medium uppercase text-[#737373]">
                      {stat.suffix}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
