"use client";

import { useState } from "react";
import type { FlashTestData } from "@/lib/mock/dynamic-data";
import { Zap } from "lucide-react";

interface FlashTestComparisonProps {
  data: FlashTestData;
}

export function FlashTestComparison({ data }: FlashTestComparisonProps) {
  const [hovered, setHovered] = useState(false);
  const maxPower = Math.max(data.flashTestPower, data.fieldPower);
  const flashHeight = (data.flashTestPower / maxPower) * 100;
  const fieldHeight = (data.fieldPower / maxPower) * 100;

  const gapColor = data.gapPercent > 10 ? "#EF4444" : data.gapPercent > 5 ? "#F59E0B" : "#22C55E";
  const gapLabel = data.gapPercent > 10 ? "Above normal" : data.gapPercent > 5 ? "Moderate" : "Normal";

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Bar comparison */}
      <div className="flex h-36 items-end justify-center gap-6">
        {/* Flash test bar */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-xs font-bold text-foreground">
            {data.flashTestPower}W
          </span>
          <div
            className="w-14 transition-all duration-300"
            style={{
              height: `${flashHeight}%`,
              backgroundColor: hovered ? "#A3A3A3" : "#D9D9D9",
            }}
          />
          <span className="text-[10px] text-muted-foreground">Flash Test</span>
        </div>

        {/* Field measurement bar */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-xs font-bold text-foreground">
            {data.fieldPower}W
          </span>
          <div
            className="w-14 transition-all duration-300"
            style={{
              height: `${fieldHeight}%`,
              backgroundColor: hovered ? "#22C55E" : "#86EFAC",
            }}
          />
          <span className="text-[10px] text-muted-foreground">Field</span>
        </div>
      </div>

      {/* Gap indicator */}
      <div className="flex items-center justify-between border-t border-dashed border-border pt-2">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3 w-3" style={{ color: gapColor }} />
          <span className="text-xs text-muted-foreground">Gap</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold" style={{ color: gapColor }}>
            -{data.gapPercent}%
          </span>
          <span
            className="px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: gapColor + "15", color: gapColor }}
          >
            {gapLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
