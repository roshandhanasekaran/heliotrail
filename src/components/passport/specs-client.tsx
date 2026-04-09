"use client";

import { GlassCard } from "@/components/passport/glass-card";
import { RadialGauge } from "@/components/passport/radial-gauge";
import { SectionTitle } from "@/components/passport/section-title";
import { ZapIcon, BoxIcon, CpuIcon } from "lucide-react";

interface SpecRow {
  param: string;
  value: string;
  highlight?: boolean;
}

interface SpecsClientProps {
  electrical: SpecRow[];
  mechanical: SpecRow[];
  gaugeData: {
    power: number;
    efficiency: number;
  };
}

export function SpecsClient({
  electrical,
  mechanical,
  gaugeData,
}: SpecsClientProps) {
  return (
    <div className="space-y-10">
      <SectionTitle
        title="Technical Specifications"
        description="Electrical and mechanical parameters at Standard Test Conditions"
        icon={CpuIcon}
      />

      {/* Gauge display */}
      <GlassCard>
        <div className="px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            <RadialGauge
              value={gaugeData.power}
              max={700}
              label="Rated Power"
              unit="W"
              size={160}
              color="#22C55E"
              showTicks
            />
            <div className="hidden sm:block w-px h-24 bg-border" />
            <RadialGauge
              value={gaugeData.efficiency}
              max={30}
              label="Efficiency"
              unit="%"
              size={160}
              color="#0D0D0D"
              showTicks
            />
          </div>
        </div>
      </GlassCard>

      {/* Spec tables */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Electrical */}
        <GlassCard>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-muted">
                <ZapIcon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Electrical Parameters</h3>
                <p className="text-[11px] text-muted-foreground">Standard Test Conditions</p>
              </div>
            </div>

            <div className="passport-table">
              <div className="passport-table-header">
                <span>Parameter</span>
                <span>Value</span>
              </div>
              {electrical.map((row) => (
                <div
                  key={row.param}
                  className="passport-table-row"
                >
                  <span className="table-label">{row.param}</span>
                  <span className={`table-value mono ${row.highlight ? "highlight" : ""}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Mechanical */}
        <GlassCard>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-muted">
                <BoxIcon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Mechanical Parameters</h3>
                <p className="text-[11px] text-muted-foreground">Physical dimensions & construction</p>
              </div>
            </div>

            <div className="passport-table">
              <div className="passport-table-header">
                <span>Parameter</span>
                <span>Value</span>
              </div>
              {mechanical.map((row) => (
                <div
                  key={row.param}
                  className="passport-table-row"
                >
                  <span className="table-label">{row.param}</span>
                  <span className={`table-value mono ${row.highlight ? "highlight" : ""}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
