"use client";

import { GlassCard } from "@/components/passport/glass-card";
import { SectionTitle } from "@/components/passport/section-title";
import { ProductRadarChart } from "@/components/passport/product-radar-chart";
import { FadeIn } from "@/components/ui/fade-in";
import { RadarIcon } from "lucide-react";
import type { Passport } from "@/types/passport";

interface RadarSectionProps {
  passport: Passport;
}

/* Normalize raw values to 0–100 scores for radar comparison.
   Ranges based on current PV module market data. */
function normalize(value: number, min: number, max: number): number {
  return Math.round(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)));
}

export function RadarSection({ passport: p }: RadarSectionProps) {
  const metrics = [
    {
      label: "Power",
      value: normalize(p.rated_power_stc_w ?? 0, 200, 700),
      raw: `${p.rated_power_stc_w ?? 0}W`,
    },
    {
      label: "Efficiency",
      value: normalize(p.module_efficiency_percent ?? 0, 15, 25),
      raw: `${p.module_efficiency_percent ?? 0}%`,
    },
    {
      label: "Low Carbon",
      // Inverted: lower carbon = higher score
      value: normalize(
        600 - (p.carbon_footprint_kg_co2e ?? 460),
        0,
        400
      ),
      raw: `${p.carbon_footprint_kg_co2e ?? "—"} kg`,
    },
    {
      label: "Warranty",
      value: normalize(p.performance_warranty_years ?? 0, 10, 35),
      raw: `${p.performance_warranty_years ?? 0}yr`,
    },
    {
      label: "Longevity",
      value: normalize(p.expected_lifetime_years ?? 0, 20, 40),
      raw: `${p.expected_lifetime_years ?? 0}yr`,
    },
    {
      label: "Durability",
      // Lower degradation = higher score
      value: normalize(
        1 - (p.linear_degradation_percent_per_year ?? 0.5),
        0,
        0.8
      ),
      raw: `${p.linear_degradation_percent_per_year ?? "—"}%/yr`,
    },
  ];

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Product Profile"
        description="Multi-dimensional comparison of key performance indicators"
        icon={RadarIcon}
      />

      <FadeIn>
        <GlassCard>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-muted">
                <RadarIcon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Performance Radar
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Normalized scores (0–100) across key specifications
                </p>
              </div>
            </div>

            <ProductRadarChart metrics={metrics} size={300} />
          </div>
        </GlassCard>
      </FadeIn>
    </section>
  );
}
