"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { CATEGORY_LABELS, type AIInsight } from "@/lib/mock/ai-analytics";

export const INSIGHT_SEVERITY: Record<AIInsight["severity"], { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-[#FEE2E2]", text: "text-[#B91C1C]", border: "border-[#FECACA]" },
  warning: { bg: "bg-[var(--passport-amber-muted)]", text: "text-[#92400E]", border: "border-[#FDE68A]" },
  info: { bg: "bg-[#EFF6FF]", text: "text-[#1E40AF]", border: "border-[#BFDBFE]" },
  success: { bg: "bg-[var(--passport-green-muted)]", text: "text-foreground", border: "border-[#BBF7D0]" },
};

export interface InsightCardProps {
  insight: AIInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const style = INSIGHT_SEVERITY[insight.severity];
  return (
    <div className="px-2.5 py-2.5 space-y-1">
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={cn(
              "shrink-0 px-1 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide",
              style.bg,
              style.text,
            )}
          >
            {CATEGORY_LABELS[insight.category]}
          </span>
          <span className={`font-mono text-[8px] ${insight.evidence.available >= insight.evidence.required ? "text-muted-foreground/70" : "text-[#F59E0B]"}`}>
            {insight.evidence.available}/{insight.evidence.required} evidence
          </span>
        </div>
        <span className="shrink-0 text-[8px] text-muted-foreground/70">
          {insight.timestamp}
        </span>
      </div>
      <p className="text-[11px] font-semibold leading-tight text-foreground">
        {insight.title}
      </p>
      <p className="text-[10px] leading-snug text-muted-foreground">
        {insight.detail}
      </p>
      {insight.action && (
        <Link
          href={insight.action.href}
          className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary hover:text-foreground transition-colors"
        >
          {insight.action.label}
          <ArrowRight className="h-2.5 w-2.5" />
        </Link>
      )}
    </div>
  );
}
