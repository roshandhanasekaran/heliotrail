"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  ShieldCheckIcon,
  RecycleIcon,
  BarChart3Icon,
  ScanLineIcon,
  UsersIcon,
  ArrowRightIcon,
} from "lucide-react";

const capabilities = [
  {
    icon: FileTextIcon,
    accent: "#6366f1",
    title: "Complete Product Identity",
    description:
      "Every module gets a unique digital passport with manufacturer data, specifications, and full traceability from factory to field.",
  },
  {
    icon: ShieldCheckIcon,
    accent: "#22c55e",
    title: "Compliance & Certifications",
    description:
      "Track IEC standards, CE declarations, and safety certifications with automatic expiry monitoring and status verification.",
  },
  {
    icon: RecycleIcon,
    accent: "#f59e0b",
    title: "Circularity Intelligence",
    description:
      "Material composition, recyclability rates, dismantling guides, and critical raw material tracking for end-of-life planning.",
  },
  {
    icon: BarChart3Icon,
    accent: "#ef4444",
    title: "Carbon Footprint Tracking",
    description:
      "Cradle-to-gate carbon footprint per ISO 14067 with full methodology transparency and environmental product declarations.",
  },
  {
    icon: ScanLineIcon,
    accent: "#8b5cf6",
    title: "QR-Based Access",
    description:
      "Every passport has a unique public ID and QR code. Scan at the installation site to instantly access the full digital record.",
  },
  {
    icon: UsersIcon,
    accent: "#06b6d4",
    title: "Role-Based Visibility",
    description:
      "Public data for consumers, restricted data for recyclers, full access for manufacturers — all enforced at the database level.",
  },
];

function CapabilityCard({
  cap,
  index,
}: {
  cap: (typeof capabilities)[number];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = cap.icon;

  return (
    <FadeIn delay={index * 0.08}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
        className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? `0 8px 40px ${cap.accent}20, 0 0 0 1px ${cap.accent}30, inset 0 1px 0 rgba(255,255,255,0.06)`
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
          borderColor: isHovered ? `${cap.accent}40` : undefined,
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300"
          style={{
            background: isHovered
              ? `linear-gradient(90deg, transparent, ${cap.accent}, transparent)`
              : "transparent",
            opacity: isHovered ? 0.8 : 0,
          }}
        />

        {/* Hover gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at 50% 0%, ${cap.accent}12, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        <div className="relative">
          <div className="mb-5 flex items-center justify-between">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
              style={{
                backgroundColor: `${cap.accent}15`,
                boxShadow: isHovered
                  ? `0 4px 20px ${cap.accent}30`
                  : "none",
              }}
            >
              <Icon
                className="h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-110"
                style={{ color: cap.accent }}
              />
            </div>
            <ArrowRightIcon
              className="h-4 w-4 text-white/0 transition-all duration-300 group-hover:text-white/40 group-hover:translate-x-0.5"
            />
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-white">
            {cap.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {cap.description}
          </p>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export function CapabilitySection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a1a] py-24">
      {/* Decorative gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* No top gradient — flows directly from dark trust bar */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
              Platform Capabilities
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything a PV passport needs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              From manufacturing data to end-of-life recycling, HelioTrail
              captures the full lifecycle of every solar module.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, i) => (
            <CapabilityCard key={cap.title} cap={cap} index={i} />
          ))}
        </div>
      </div>

      {/* No bottom gradient — flows directly into CTA footer */}
    </section>
  );
}
