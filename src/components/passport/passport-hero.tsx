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
  { label: "Rated Power", value: `${p.rated_power_stc_w ?? "—"}`, unit: "W", icon: ZapIcon, color: "#6366f1" },
  { label: "Efficiency", value: `${p.module_efficiency_percent ?? "—"}`, unit: "%", icon: GaugeIcon, color: "#22c55e" },
  { label: "Carbon", value: `${p.carbon_footprint_kg_co2e ?? "—"}`, unit: "kg", icon: LeafIcon, color: "#10b981" },
  { label: "Lifetime", value: `${p.expected_lifetime_years ?? "—"}`, unit: "yr", icon: CalendarIcon, color: "#f59e0b" },
  { label: "Warranty", value: `${p.product_warranty_years ?? "—"}`, unit: "yr", icon: ShieldCheckIcon, color: "#3b82f6" },
  { label: "Cells", value: `${p.cell_count ?? "—"}`, unit: "", icon: GridIcon, color: "#8b5cf6" },
];

export function PassportHero({ passport }: PassportHeroProps) {
  const stats = quickStats(passport);

  return (
    <div className="relative overflow-hidden bg-card border-b border-border/50">
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Status banner */}
        <FadeIn>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-semibold text-primary">
                  Active Passport
                </span>
              </div>
              <Badge variant="secondary" className="rounded-full text-xs">
                {MODULE_TECHNOLOGY_LABELS[passport.module_technology] ??
                  passport.module_technology}
              </Badge>
              <Badge className="rounded-full border-primary/20 bg-primary/10 text-primary text-xs">
                <ShieldCheckIcon className="mr-1 h-3 w-3" />
                {VERIFICATION_STATUS_LABELS[passport.verification_status]}
              </Badge>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
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
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {passport.model_id}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                <span className="font-semibold text-primary">
                  {formatWatts(passport.rated_power_stc_w)}
                </span>
                {" \u00b7 "}
                {passport.manufacturer_name}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:text-right">
              <span className="flex items-center gap-1.5 sm:justify-end">
                <FactoryIcon className="h-3.5 w-3.5 text-muted-foreground/60" />
                {passport.facility_name ?? "—"}
              </span>
              <span className="flex items-center gap-1.5 sm:justify-end">
                <ClockIcon className="h-3.5 w-3.5 text-muted-foreground/60" />
                Manufactured {formatDate(passport.manufacturing_date)}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Quick stats grid */}
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
                  className="rounded-xl bg-muted/50 px-4 py-3"
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" style={{ color: stat.color }} />
                    <p className="text-xs text-muted-foreground">
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
