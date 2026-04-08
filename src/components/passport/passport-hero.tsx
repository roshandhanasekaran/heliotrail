"use client";

import { Badge } from "@/components/ui/badge";
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
  { label: "RATED POWER", value: `${p.rated_power_stc_w ?? "—"}`, unit: "W", icon: ZapIcon, color: "#4caf50" },
  { label: "EFFICIENCY", value: `${p.module_efficiency_percent ?? "—"}`, unit: "%", icon: GaugeIcon, color: "#689f38" },
  { label: "CARBON", value: `${p.carbon_footprint_kg_co2e ?? "—"}`, unit: "kg", icon: LeafIcon, color: "#4caf50" },
  { label: "LIFETIME", value: `${p.expected_lifetime_years ?? "—"}`, unit: "yr", icon: CalendarIcon, color: "#ffa000" },
  { label: "WARRANTY", value: `${p.product_warranty_years ?? "—"}`, unit: "yr", icon: ShieldCheckIcon, color: "#64b5f6" },
  { label: "CELLS", value: `${p.cell_count ?? "—"}`, unit: "", icon: GridIcon, color: "#a1887f" },
];

export function PassportHero({ passport }: PassportHeroProps) {
  const stats = quickStats(passport);

  return (
    <div className="relative overflow-hidden border-b border-border">
      {/* Top accent line */}
      <div className="h-1 bg-primary" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Status banner */}
        <FadeIn>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 bg-primary" />
                </span>
                <span className="text-xs font-bold tracking-[0.15em] text-primary uppercase">
                  Active Passport
                </span>
              </div>
              <Badge variant="secondary" className="text-xs border-border">
                {MODULE_TECHNOLOGY_LABELS[passport.module_technology] ??
                  passport.module_technology}
              </Badge>
              <Badge className="border-primary/30 bg-primary/10 text-primary text-xs">
                <ShieldCheckIcon className="mr-1 h-3 w-3" />
                {VERIFICATION_STATUS_LABELS[passport.verification_status]}
              </Badge>
            </div>
            <div className="hidden sm:flex items-center gap-2 border border-border bg-muted px-3 py-1">
              <span className="font-mono text-xs text-muted-foreground">
                {passport.pv_passport_id}
              </span>
              <button
                className="p-0.5 hover:text-primary transition-colors"
                onClick={() =>
                  navigator.clipboard.writeText(passport.pv_passport_id)
                }
              >
                <CopyIcon className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Main content */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight uppercase sm:text-5xl lg:text-6xl">
                {passport.model_id}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                <span className="font-mono text-primary">
                  {formatWatts(passport.rated_power_stc_w)}
                </span>
                {" // "}
                {passport.manufacturer_name}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:text-right">
              <span className="flex items-center gap-1.5 sm:justify-end">
                <FactoryIcon className="h-3.5 w-3.5 text-primary/70" />
                {passport.facility_name ?? "—"}
              </span>
              <span className="flex items-center gap-1.5 sm:justify-end">
                <ClockIcon className="h-3.5 w-3.5 text-primary/70" />
                MFG {formatDate(passport.manufacturing_date)}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Quick stats grid */}
        <FadeIn delay={0.2}>
          <div className="mt-8 grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6 border border-border bg-border">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="bg-card px-4 py-3"
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3 w-3" style={{ color: stat.color }} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className="text-2xl font-bold font-mono tabular-nums"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-xs text-muted-foreground">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
