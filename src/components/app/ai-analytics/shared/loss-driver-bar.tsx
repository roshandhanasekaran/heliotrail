"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function fmtEur(v: number): string {
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1_000) return `€${(v / 1_000).toFixed(1)}k`;
  return `€${v.toFixed(0)}`;
}

export interface LossDriverBarProps {
  category: string;
  euroPerMonth: number;
  percent: number;
  color: string;
  trend: "up" | "down" | "stable";
}

export function LossDriverBar({
  category,
  euroPerMonth,
  percent,
  color,
  trend,
}: LossDriverBarProps) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-[#737373]">{category}</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] font-semibold text-[#0D0D0D]">
            {fmtEur(euroPerMonth)}
          </span>
          {trend === "up" ? (
            <TrendingUp className="h-2.5 w-2.5 text-[#DC2626]" />
          ) : trend === "down" ? (
            <TrendingDown className="h-2.5 w-2.5 text-[#22C55E]" />
          ) : (
            <Minus className="h-2.5 w-2.5 text-[#A3A3A3]" />
          )}
        </div>
      </div>
      <div className="h-1.5 w-full bg-[#F2F2F2]">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
