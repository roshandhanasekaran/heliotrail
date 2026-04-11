"use client";

import type { RevenueLossBreakdown } from "@/lib/mock/dynamic-data";
import { TrendingDown } from "lucide-react";

interface RevenueImpactProps {
  data: RevenueLossBreakdown;
}

export function RevenueImpact({ data }: RevenueImpactProps) {
  const totalLossKwh = data.losses.reduce((s, l) => s + l.kwhLost, 0);
  const totalLossEuro = data.losses.reduce((s, l) => s + l.euroLost, 0);
  const gapPercent = (
    ((data.totalExpected - data.totalActual) / data.totalExpected) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Expected Output
          </p>
          <p className="font-mono text-xl font-bold text-foreground">
            {data.totalExpected.toLocaleString()}{" "}
            <span className="text-xs font-normal text-muted-foreground">kWh</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Actual Output
          </p>
          <p className="font-mono text-xl font-bold text-foreground">
            {data.totalActual.toLocaleString()}{" "}
            <span className="text-xs font-normal text-muted-foreground">kWh</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Performance Gap
          </p>
          <p className="flex items-center gap-1 font-mono text-xl font-bold text-[#EF4444]">
            <TrendingDown className="h-4 w-4" />
            {gapPercent}%
          </p>
        </div>
      </div>

      {/* Segmented loss bar */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Loss Breakdown
        </p>
        <div className="flex h-3 w-full overflow-hidden">
          {data.losses.map((loss) => {
            const widthPercent =
              totalLossKwh > 0 ? (loss.kwhLost / totalLossKwh) * 100 : 0;
            return (
              <div
                key={loss.category}
                style={{ width: `${widthPercent}%`, backgroundColor: loss.color }}
                className="transition-all"
                title={`${loss.category}: ${loss.kwhLost} kWh`}
              />
            );
          })}
        </div>

        {/* Legend with values */}
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
          {data.losses.map((loss) => (
            <div key={loss.category} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0"
                style={{ backgroundColor: loss.color }}
              />
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground">
                  {loss.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {loss.kwhLost} kWh
                  </span>
                  <span className="text-[10px] text-[#EF4444]">
                    -€{loss.euroLost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total loss */}
      <div className="border-t border-dashed border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Total Monthly Revenue Loss
          </span>
          <span className="font-mono text-lg font-bold text-[#EF4444]">
            -€{totalLossEuro.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
