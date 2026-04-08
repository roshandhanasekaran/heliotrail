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
} from "lucide-react";
import { motion } from "framer-motion";

interface PassportHeroProps {
  passport: Passport;
}

export function PassportHero({ passport }: PassportHeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Status banner */}
        <FadeIn>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1"
                animate={{ boxShadow: ["0 0 0 0 rgba(76,175,80,0.4)", "0 0 0 8px rgba(76,175,80,0)", "0 0 0 0 rgba(76,175,80,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-semibold text-primary">
                  ACTIVE PASSPORT
                </span>
              </motion.div>
              <Badge variant="secondary" className="text-xs">
                {MODULE_TECHNOLOGY_LABELS[passport.module_technology] ??
                  passport.module_technology}
              </Badge>
              <Badge
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs"
              >
                <ShieldCheckIcon className="mr-1 h-3 w-3" />
                {VERIFICATION_STATUS_LABELS[passport.verification_status]}
              </Badge>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {passport.pv_passport_id}
              </span>
              <button
                className="rounded p-1 hover:bg-muted transition-colors"
                onClick={() => navigator.clipboard.writeText(passport.pv_passport_id)}
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
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {passport.model_id}
              </h1>
              <p className="mt-2 text-xl text-muted-foreground">
                {formatWatts(passport.rated_power_stc_w)} &middot;{" "}
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
                Manufactured {formatDate(passport.manufacturing_date)}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Quick stats */}
        <FadeIn delay={0.2}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {[
              { label: "RATED POWER", value: `${passport.rated_power_stc_w ?? "—"}W` },
              { label: "EFFICIENCY", value: `${passport.module_efficiency_percent ?? "—"}%` },
              { label: "CARBON", value: `${passport.carbon_footprint_kg_co2e ?? "—"} kg` },
              { label: "LIFETIME", value: `${passport.expected_lifetime_years ?? "—"} yr` },
              { label: "WARRANTY", value: `${passport.product_warranty_years ?? "—"} yr` },
              { label: "CELLS", value: `${passport.cell_count ?? "—"}` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border/50 bg-card/50 px-3 py-2.5 backdrop-blur-sm"
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-lg font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Bottom border gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
