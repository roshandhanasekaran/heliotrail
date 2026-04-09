"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";
import type { MLAnomaly } from "@/lib/mock/ai-analytics";

export const ANOMALY_SEVERITY: Record<MLAnomaly["severity"], string> = {
  high: "bg-[#FEE2E2] text-[#B91C1C]",
  medium: "bg-[#FEF3C7] text-[#92400E]",
  low: "bg-[#F3F4F6] text-[#6B7280]",
};

export const PATTERN_BADGE: Record<MLAnomaly["pattern"], { label: string; color: string }> = {
  recurring: { label: "Recurring", color: "text-[#DC2626]" },
  escalating: { label: "Escalating", color: "text-[#F59E0B]" },
  "one-off": { label: "One-off", color: "text-[#6B7280]" },
};

export interface AnomalyCardProps {
  anomaly: MLAnomaly;
}

export function AnomalyCard({ anomaly }: AnomalyCardProps) {
  return (
    <div className="px-2.5 py-2.5 space-y-1">
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "px-1 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide",
              ANOMALY_SEVERITY[anomaly.severity],
            )}
          >
            {anomaly.severity}
          </span>
          <span
            className={cn(
              "text-[8px] font-semibold",
              PATTERN_BADGE[anomaly.pattern].color,
            )}
          >
            {PATTERN_BADGE[anomaly.pattern].label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[8px] text-[#A3A3A3]">
            {anomaly.mlConfidence}%
          </span>
          {anomaly.resolved ? (
            <CheckCircle2 className="h-2.5 w-2.5 text-[#22C55E]" />
          ) : (
            <Clock className="h-2.5 w-2.5 text-[#F59E0B]" />
          )}
        </div>
      </div>
      <p className="text-[11px] font-semibold leading-tight text-[#0D0D0D]">
        {anomaly.type}
        {anomaly.module && (
          <span className="ml-1 font-mono text-[9px] font-normal text-[#A3A3A3]">
            {anomaly.module}
          </span>
        )}
      </p>
      <p className="text-[10px] leading-snug text-[#737373]">
        {anomaly.description}
      </p>
      <span className="text-[8px] text-[#A3A3A3]">{anomaly.timestamp}</span>
    </div>
  );
}
