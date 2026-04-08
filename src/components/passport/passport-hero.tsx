"use client";

import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { SparklesCore } from "@/components/ui/sparkles";
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
  BatteryChargingIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface PassportHeroProps {
  passport: Passport;
}

const quickStats = (p: Passport) => [
  {
    label: "RATED POWER",
    value: `${p.rated_power_stc_w ?? "—"}`,
    unit: "W",
    icon: ZapIcon,
    color: "#4caf50",
  },
  {
    label: "EFFICIENCY",
    value: `${p.module_efficiency_percent ?? "—"}`,
    unit: "%",
    icon: GaugeIcon,
    color: "#2196f3",
  },
  {
    label: "CARBON",
    value: `${p.carbon_footprint_kg_co2e ?? "—"}`,
    unit: "kg CO₂",
    icon: LeafIcon,
    color: "#66bb6a",
  },
  {
    label: "LIFETIME",
    value: `${p.expected_lifetime_years ?? "—"}`,
    unit: "years",
    icon: CalendarIcon,
    color: "#ff9800",
  },
  {
    label: "WARRANTY",
    value: `${p.product_warranty_years ?? "—"}`,
    unit: "years",
    icon: ShieldCheckIcon,
    color: "#ab47bc",
  },
  {
    label: "CELLS",
    value: `${p.cell_count ?? "—"}`,
    unit: "",
    icon: GridIcon,
    color: "#26a69a",
  },
];

export function PassportHero({ passport }: PassportHeroProps) {
  const stats = quickStats(passport);

  return (
    <div className="relative overflow-hidden">
      {/* Sparkle particles */}
      <div className="absolute inset-0 z-0">
        <SparklesCore
          id="passport-hero-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.4}
          particleDensity={40}
          className="h-full w-full"
          particleColor="#4caf50"
          speed={0.8}
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Status banner */}
        <FadeIn>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <motion.div
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-md"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(76,175,80,0.4)",
                    "0 0 0 10px rgba(76,175,80,0)",
                    "0 0 0 0 rgba(76,175,80,0)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-bold tracking-wider text-primary">
                  ACTIVE PASSPORT
                </span>
              </motion.div>
              <Badge
                variant="secondary"
                className="border-white/10 bg-white/5 text-xs backdrop-blur-md"
              >
                {MODULE_TECHNOLOGY_LABELS[passport.module_technology] ??
                  passport.module_technology}
              </Badge>
              <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs backdrop-blur-md">
                <ShieldCheckIcon className="mr-1 h-3 w-3" />
                {VERIFICATION_STATUS_LABELS[passport.verification_status]}
              </Badge>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 backdrop-blur-md">
              <span className="font-mono text-xs text-muted-foreground">
                {passport.pv_passport_id}
              </span>
              <button
                className="rounded-full p-1 hover:bg-white/10 transition-colors"
                onClick={() =>
                  navigator.clipboard.writeText(passport.pv_passport_id)
                }
              >
                <CopyIcon className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Main hero content */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                  {passport.model_id}
                </span>
              </h1>
              <p className="mt-3 text-xl text-muted-foreground">
                <span className="font-mono text-primary/80">
                  {formatWatts(passport.rated_power_stc_w)}
                </span>{" "}
                <span className="text-muted-foreground/40">&middot;</span>{" "}
                {passport.manufacturer_name}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:text-right">
              <span className="flex items-center gap-2 sm:justify-end">
                <FactoryIcon className="h-3.5 w-3.5 text-primary/60" />
                {passport.facility_name ?? "—"}
              </span>
              <span className="flex items-center gap-2 sm:justify-end">
                <ClockIcon className="h-3.5 w-3.5 text-primary/60" />
                Manufactured {formatDate(passport.manufacturing_date)}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Quick stats — glassmorphism cards */}
        <FadeIn delay={0.2}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
                  style={{
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 30px ${stat.color}06`,
                  }}
                >
                  {/* Colored glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 100%, ${stat.color}10 0%, transparent 70%)`,
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className="h-3 w-3"
                        style={{ color: stat.color }}
                      />
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        {stat.label}
                      </p>
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-1">
                      <span
                        className="text-2xl font-bold font-mono tabular-nums"
                        style={{
                          color: stat.color,
                          textShadow: `0 0 15px ${stat.color}30`,
                        }}
                      >
                        {stat.value}
                      </span>
                      {stat.unit && (
                        <span className="text-xs text-muted-foreground/60">
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

      {/* Bottom gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}
