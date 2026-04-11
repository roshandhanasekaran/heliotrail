"use client";

import { GlassCard } from "@/components/passport/glass-card";
import { SectionTitle } from "@/components/passport/section-title";
import { CarbonComparisonChart } from "@/components/passport/carbon-comparison-chart";
import { FadeIn } from "@/components/ui/fade-in";
import { CloudIcon } from "lucide-react";

interface CarbonSectionProps {
  carbonFootprintKgCo2e: number;
  moduleTechnology: string;
}

export function CarbonSection({
  carbonFootprintKgCo2e,
  moduleTechnology,
}: CarbonSectionProps) {
  return (
    <section className="space-y-6">
      <SectionTitle
        title="Carbon Footprint"
        description="Lifecycle carbon emissions compared to industry benchmarks"
        icon={CloudIcon}
      />

      <FadeIn>
        <GlassCard>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-muted">
                <CloudIcon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  CO&#8322; Emissions Comparison
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Module carbon footprint vs. industry averages (kg CO&#8322;e)
                </p>
              </div>
            </div>

            <CarbonComparisonChart
              carbonFootprintKgCo2e={carbonFootprintKgCo2e}
              moduleTechnology={moduleTechnology}
            />
          </div>
        </GlassCard>
      </FadeIn>
    </section>
  );
}
