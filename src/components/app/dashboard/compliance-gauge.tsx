"use client";

import { AnimatedCounter } from "@/components/shared/animated-counter";

interface ComplianceGaugeProps {
  score: number;
  max?: number;
  size?: number;
  validCerts: number;
  pendingCerts: number;
  expiredCerts: number;
  totalCerts: number;
}

export function ComplianceGauge({
  score,
  max = 100,
  size = 160,
  validCerts,
  pendingCerts,
  expiredCerts,
  totalCerts,
}: ComplianceGaugeProps) {
  const pct = Math.min(score / max, 1);
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  const color = pct >= 0.9 ? "#22C55E" : pct >= 0.7 ? "#F59E0B" : "#EF4444";
  const bgColor = pct >= 0.9 ? "#E8FAE9" : pct >= 0.7 ? "#FEF3C7" : "#FEE2E2";

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#F2F2F2"
            strokeWidth={8}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedCounter
            value={score}
            suffix="%"
            className="text-3xl font-bold tabular-nums text-[#0D0D0D]"
          />
          <span className="text-[0.625rem] text-[#737373]">compliance</span>
        </div>
      </div>

      {/* Certificate breakdown */}
      <div className="mt-4 w-full space-y-2">
        <div className="flex h-2 w-full overflow-hidden">
          {totalCerts > 0 && (
            <>
              <div
                className="bg-[#22C55E]"
                style={{ width: `${(validCerts / totalCerts) * 100}%` }}
              />
              <div
                className="bg-[#F59E0B]"
                style={{ width: `${(pendingCerts / totalCerts) * 100}%` }}
              />
              <div
                className="bg-[#EF4444]"
                style={{ width: `${(expiredCerts / totalCerts) * 100}%` }}
              />
            </>
          )}
        </div>
        <div className="flex justify-between text-[0.625rem]">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#22C55E]" />
            <span className="text-[#737373]">{validCerts} valid</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#F59E0B]" />
            <span className="text-[#737373]">{pendingCerts} pending</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#EF4444]" />
            <span className="text-[#737373]">{expiredCerts} expired</span>
          </span>
        </div>
      </div>
    </div>
  );
}
