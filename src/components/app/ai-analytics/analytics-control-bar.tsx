"use client";

import { useEffect, useState } from "react";
import type { Persona, TimeRange } from "@/lib/ai-analytics-types";
import { getFleetBenchmarking } from "@/lib/mock/ai-analytics";

// ─── Derived model list from fleet benchmarking data ──────────
const benchmarks = getFleetBenchmarking();
const uniqueModels = Array.from(new Set(benchmarks.map((b) => b.modelId)));
const totalModules = benchmarks.length;

// ─── Constants ────────────────────────────────────────────────
const PERSONA_OPTIONS: { value: Persona; label: string }[] = [
  { value: "manufacturer", label: "Manufacturer" },
  { value: "operator", label: "Operator" },
];

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

// ─── Props ────────────────────────────────────────────────────
interface AnalyticsControlBarProps {
  persona: Persona;
  onPersonaChange: (persona: Persona) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  modelFilter: string;
  onModelFilterChange: (model: string) => void;
}

// ─── Component ────────────────────────────────────────────────
export function AnalyticsControlBar({
  persona,
  onPersonaChange,
  timeRange,
  onTimeRangeChange,
  modelFilter,
  onModelFilterChange,
}: AnalyticsControlBarProps) {
  const [minutesAgo, setMinutesAgo] = useState(2);

  // Sync indicator: tick every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesAgo((prev) => prev + 1);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 border-b border-[#E5E5E5] bg-white px-5 py-3">
      {/* ── Persona Toggle ──────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
          View
        </span>
        <div className="flex rounded-full bg-[#F5F5F5] p-0.5">
          {PERSONA_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPersonaChange(opt.value)}
              className="rounded-full px-3 py-1 text-[11px] font-semibold transition-colors"
              style={{
                backgroundColor:
                  persona === opt.value ? "#0D0D0D" : "transparent",
                color: persona === opt.value ? "#FFFFFF" : "#737373",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="h-6 w-px bg-[#E5E5E5]" />

      {/* ── Time Range Selector ─────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
          Period
        </span>
        <div className="flex gap-1">
          {TIME_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onTimeRangeChange(opt.value)}
              className="rounded px-2.5 py-1 text-[11px] font-semibold transition-colors"
              style={{
                backgroundColor:
                  timeRange === opt.value ? "#22C55E" : "#FFFFFF",
                color: timeRange === opt.value ? "#FFFFFF" : "#737373",
                border:
                  timeRange === opt.value
                    ? "1px solid #22C55E"
                    : "1px solid #E5E5E5",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="h-6 w-px bg-[#E5E5E5]" />

      {/* ── Model Filter ────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
          Model
        </span>
        <select
          value={modelFilter}
          onChange={(e) => onModelFilterChange(e.target.value)}
          className="rounded border border-[#E5E5E5] bg-white px-2 py-1 text-[11px] text-[#0D0D0D] outline-none focus:border-[#22C55E]"
        >
          <option value="all">All Models ({totalModules})</option>
          {uniqueModels.map((model) => {
            const count = benchmarks.filter((b) => b.modelId === model).length;
            return (
              <option key={model} value={model}>
                {model} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="h-6 w-px bg-[#E5E5E5]" />

      {/* ── Sync Indicator ──────────────────────────────── */}
      <div className="ml-auto flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
        </span>
        <span className="text-[10px] text-[#737373]">
          Last sync: {minutesAgo} min ago
        </span>
      </div>
    </div>
  );
}
