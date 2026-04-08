"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { GlassButton } from "@/components/ui/glass-button";
import { WebGLShader } from "@/components/ui/web-gl-shader";
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
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#0a0a1a]">
      {/* WebGL shader background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <WebGLShader />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[#0a0a1a]/30 to-[#0a0a1a]" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,transparent_0%,#0a0a1a_75%)]" />

      {/* Animated gradient orb */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(129,140,248,0.04) 50%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
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
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
              </span>
              EU ESPR Digital Product Passport Platform
            </motion.div>
          </FadeIn>

          {/* Main heading */}
          <FadeIn delay={0.2}>
            <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">The Digital Identity</span>
              <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                of Every Solar Panel
              </span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.3}>
            <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
              Full lifecycle traceability — from raw materials to end-of-life
              recycling. Compliance, carbon footprint, and circularity data in
              one immutable digital passport.
            </p>
          </FadeIn>

          {/* CTA buttons */}
          <FadeIn delay={0.4}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/passport/topcon-550-bf-2026-001">
                <GlassButton
                  size="lg"
                  contentClassName="flex items-center gap-2 text-white"
                >
                  Explore Demo Passport
                  <ArrowRightIcon className="h-4 w-4" />
                </GlassButton>
              </Link>
              <Link href="/scan">
                <GlassButton
                  size="default"
                  contentClassName="flex items-center gap-2 text-slate-300"
                >
                  <ScanLineIcon className="h-4 w-4" />
                  Scan QR Code
                </GlassButton>
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
                  label: "kg CO\u2082e / Module",
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
                  <stat.icon className="h-5 w-5 text-indigo-400 mb-2" />
                  <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    <AnimatedCounter value={stat.value} />
                    <span className="text-indigo-400">{stat.suffix}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom gradient transition to light theme */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
