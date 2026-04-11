"use client";

import { GlassCard } from "@/components/passport/glass-card";
import { SectionTitle } from "@/components/passport/section-title";
import { DegradationLineChart } from "@/components/passport/degradation-line-chart";
import { FadeIn } from "@/components/ui/fade-in";
import { TrendingDownIcon } from "lucide-react";

interface DegradationSectionProps {
  degradationPercentPerYear: number;
  expectedLifetimeYears: number;
  performanceWarrantyYears: number;
  performanceWarrantyPercent: number;
  ratedPowerW: number;
}

export function DegradationSection({
  degradationPercentPerYear,
  expectedLifetimeYears,
  performanceWarrantyYears,
  performanceWarrantyPercent,
  ratedPowerW,
}: DegradationSectionProps) {
  return (
    <section className="space-y-6">
      <SectionTitle
        title="Power Degradation Curve"
        description="Projected module output over its expected lifetime"
        icon={TrendingDownIcon}
      />

      <FadeIn>
        <GlassCard>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-muted">
                <TrendingDownIcon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Projected Power Output
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Based on {degradationPercentPerYear}%/yr linear degradation from rated {ratedPowerW}W
                </p>
              </div>
            </div>

            <DegradationLineChart
              degradationPercentPerYear={degradationPercentPerYear}
              expectedLifetimeYears={expectedLifetimeYears}
              performanceWarrantyYears={performanceWarrantyYears}
              performanceWarrantyPercent={performanceWarrantyPercent}
              ratedPowerW={ratedPowerW}
            />
          </div>
        </GlassCard>
      </FadeIn>
    </section>
  );
}
