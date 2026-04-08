"use client";

import { FadeIn } from "@/components/ui/fade-in";
import {
  MODULE_TECHNOLOGY_LABELS,
  VERIFICATION_STATUS_LABELS,
} from "@/lib/constants";
import { formatWatts, formatDate } from "@/lib/utils";
import type { Passport } from "@/types/passport";
import {
  ShieldCheckIcon,
  ClockIcon,
  FactoryIcon,
  CopyIcon,
  ZapIcon,
  GaugeIcon,
  LeafIcon,
  CalendarIcon,
  GridIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface PassportHeroProps {
  passport: Passport;
}

const quickStats = (p: Passport) => [
  { label: "Rated Power", value: `${p.rated_power_stc_w ?? "\u2014"}`, unit: "W", icon: ZapIcon, color: "#818cf8" },
  { label: "Efficiency", value: `${p.module_efficiency_percent ?? "\u2014"}`, unit: "%", icon: GaugeIcon, color: "#34d399" },
  { label: "Carbon", value: `${p.carbon_footprint_kg_co2e ?? "\u2014"}`, unit: "kg", icon: LeafIcon, color: "#6ee7b7" },
  { label: "Lifetime", value: `${p.expected_lifetime_years ?? "\u2014"}`, unit: "yr", icon: CalendarIcon, color: "#fbbf24" },
  { label: "Warranty", value: `${p.product_warranty_years ?? "\u2014"}`, unit: "yr", icon: ShieldCheckIcon, color: "#60a5fa" },
  { label: "Cells", value: `${p.cell_count ?? "\u2014"}`, unit: "", icon: GridIcon, color: "#c084fc" },
];

export function PassportHero({ passport }: PassportHeroProps) {
  const stats = quickStats(passport);

  return (
    <div className="relative overflow-hidden bg-[#0a0a1a]">
      {/* Gradient orbs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Status banner */}
        <FadeIn>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
                </span>
                <span className="text-xs font-semibold text-indigo-300">
                  Active Passport
                </span>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                {MODULE_TECHNOLOGY_LABELS[passport.module_technology] ??
                  passport.module_technology}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <ShieldCheckIcon className="h-3 w-3" />
                {VERIFICATION_STATUS_LABELS[passport.verification_status]}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="font-mono text-xs text-slate-400">
                {passport.pv_passport_id}
              </span>
              <button
                className="p-0.5 hover:text-indigo-400 transition-colors"
                onClick={() =>
                  navigator.clipboard.writeText(passport.pv_passport_id)
                }
              >
                <CopyIcon className="h-3 w-3 text-slate-500" />
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Main content */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {passport.model_id}
              </h1>
              <p className="mt-2 text-lg text-slate-400">
                <span className="font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {formatWatts(passport.rated_power_stc_w)}
                </span>
                {" \u00b7 "}
                {passport.manufacturer_name}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-slate-500 sm:text-right">
              <span className="flex items-center gap-1.5 sm:justify-end">
                <FactoryIcon className="h-3.5 w-3.5 text-slate-600" />
                {passport.facility_name ?? "\u2014"}
              </span>
              <span className="flex items-center gap-1.5 sm:justify-end">
                <ClockIcon className="h-3.5 w-3.5 text-slate-600" />
                Manufactured {formatDate(passport.manufacturing_date)}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Quick stats grid — glassmorphic dark cards */}
        <FadeIn delay={0.2}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 backdrop-blur-sm transition-all duration-300"
                  style={{
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                    }}
                  />
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(120px circle at 50% 0%, ${stat.color}15, transparent 70%)`,
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" style={{ color: stat.color }} />
                      <p className="text-xs text-slate-500">
                        {stat.label}
                      </p>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span
                        className="text-2xl font-bold tabular-nums"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </span>
                      {stat.unit && (
                        <span className="text-xs text-slate-600">
                          {stat.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>
      </div>

      {/* Bottom gradient to light content */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
