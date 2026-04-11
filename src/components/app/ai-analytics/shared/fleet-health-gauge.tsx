"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { FleetHealthScore } from "@/lib/mock/ai-analytics";

export interface FleetHealthGaugeProps {
  score: number;
  delta: number;
  breakdown: FleetHealthScore["breakdown"];
}

export function FleetHealthGauge({ score, delta, breakdown }: FleetHealthGaugeProps) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score > 85 ? "#22C55E" : score > 70 ? "#F59E0B" : "#DC2626";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="108" height="108" viewBox="0 0 108 108">
          {/* Background track */}
          <circle
            cx="54"
            cy="54"
            r={r}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="5"
          />
          {/* Score arc */}
          <circle
            cx="54"
            cy="54"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            transform="rotate(-90 54 54)"
            className="transition-all duration-700"
          />
          {/* Breakdown arcs (thin inner rings) */}
          {breakdown.map((b, i) => {
            const innerR = 34;
            const innerCirc = 2 * Math.PI * innerR;
            const segmentLength = (b.weight * b.score) / 100 * innerCirc;
            const prevOffset = breakdown
              .slice(0, i)
              .reduce((sum, prev) => sum + (prev.weight * prev.score) / 100, 0) * innerCirc;
            return (
              <circle
                key={b.label}
                cx="54"
                cy="54"
                r={innerR}
                fill="none"
                stroke={b.color}
                strokeWidth="2.5"
                strokeDasharray={`${segmentLength} ${innerCirc - segmentLength}`}
                strokeDashoffset={-prevOffset}
                transform="rotate(-90 54 54)"
                opacity={0.5}
              />
            );
          })}
          {/* Center text */}
          <text
            x="54"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground"
            fontSize="22"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {score}
          </text>
          <text
            x="54"
            y="67"
            textAnchor="middle"
            className="fill-muted-foreground/70"
            fontSize="8"
            fontFamily="DM Sans, sans-serif"
          >
            fleet health
          </text>
        </svg>
        {/* Delta badge */}
        <div
          className={cn(
            "absolute -right-1 top-0 flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold",
            delta >= 0
              ? "bg-[var(--passport-green-muted)] text-foreground"
              : "bg-[#FEE2E2] text-[#B91C1C]",
          )}
        >
          {delta >= 0 ? (
            <TrendingUp className="h-2.5 w-2.5" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5" />
          )}
          {delta > 0 ? "+" : ""}
          {delta}
        </div>
      </div>
    </div>
  );
}
