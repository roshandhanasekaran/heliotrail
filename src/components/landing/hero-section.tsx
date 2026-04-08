"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ScanLineIcon,
  ShieldCheckIcon,
  RecycleIcon,
  ZapIcon,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Sparkle particles background */}
      <div className="absolute inset-0 z-0">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.4}
          particleDensity={80}
          className="h-full w-full"
          particleColor="#4caf50"
          speed={0.8}
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-background/20 to-background" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--background)_70%)]" />

      {/* Animated gradient orb */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(76,175,80,0.15) 0%, rgba(46,125,50,0.05) 50%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <FadeIn delay={0.1}>
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              EU ESPR Digital Product Passport Platform
            </motion.div>
          </FadeIn>

          {/* Main heading */}
          <FadeIn delay={0.2}>
            <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-foreground">The Digital Identity</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                of Every Solar Panel
              </span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.3}>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Full lifecycle traceability — from raw materials to end-of-life
              recycling. Compliance, carbon footprint, and circularity data in
              one immutable digital passport.
            </p>
          </FadeIn>

          {/* CTA buttons */}
          <FadeIn delay={0.4}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/passport/topcon-550-bf-2026-001"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "gap-2 px-6 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow",
                })}
              >
                Explore Demo Passport
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/scan"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "gap-2 px-6 text-base border-primary/30 hover:bg-primary/10 hover:border-primary/50",
                })}
              >
                <ScanLineIcon className="h-4 w-4" />
                Scan QR Code
              </Link>
            </div>
          </FadeIn>

          {/* Stats bar */}
          <FadeIn delay={0.6}>
            <div className="mt-20 grid grid-cols-3 gap-8 sm:gap-16">
              {[
                {
                  value: 92,
                  suffix: "%",
                  label: "Recyclability Rate",
                  icon: RecycleIcon,
                },
                {
                  value: 385,
                  suffix: "",
                  label: "kg CO₂e / Module",
                  icon: ZapIcon,
                },
                {
                  value: 35,
                  suffix: " yr",
                  label: "Expected Lifetime",
                  icon: ShieldCheckIcon,
                },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <stat.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                    <AnimatedCounter value={stat.value} />
                    <span className="text-primary">{stat.suffix}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom fade gradient line */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
