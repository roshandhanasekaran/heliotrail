"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import type { Persona, TimeRange, FleetOption } from "@/lib/ai-analytics-types";

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
  fleetId: string | null;
  onFleetChange: (fleetId: string | null) => void;
  fleetOptions: FleetOption[];
}

// ─── Component ────────────────────────────────────────────────
export function AnalyticsControlBar({
  persona,
  onPersonaChange,
  timeRange,
  onTimeRangeChange,
  fleetId,
  onFleetChange,
  fleetOptions,
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
    <div className="flex items-center gap-4 border-b border-border bg-card px-5 py-3">
      {/* ── Persona Toggle ──────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          View
        </span>
        <div className="flex rounded-full bg-muted p-0.5">
          {PERSONA_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPersonaChange(opt.value)}
              className="rounded-full px-3 py-1 text-[11px] font-semibold transition-colors"
              style={{
                backgroundColor:
                  persona === opt.value ? "var(--foreground)" : "transparent",
                color: persona === opt.value ? "var(--card)" : "var(--muted-foreground)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="h-6 w-px bg-border" />

      {/* ── Fleet Selector ─────────────────────────────── */}
      <div className="flex items-center gap-2">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Fleet
        </span>
        <select
          value={fleetId ?? ""}
          onChange={(e) => onFleetChange(e.target.value || null)}
          className="rounded px-2.5 py-1 text-[11px] font-semibold transition-colors bg-card text-foreground"
          style={{
            border: "1px solid var(--border)",
            outline: "none",
            maxWidth: "220px",
          }}
        >
          <option value="">All Fleets ({fleetOptions.reduce((s, f) => s + f.moduleCount, 0)} modules)</option>
          {fleetOptions.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} — {f.city}, {f.country} ({f.moduleCount})
            </option>
          ))}
        </select>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="h-6 w-px bg-border" />

      {/* ── Time Range Selector ─────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
                  timeRange === opt.value ? "var(--primary)" : "var(--card)",
                color: timeRange === opt.value ? "white" : "var(--muted-foreground)",
                border:
                  timeRange === opt.value
                    ? "1px solid var(--primary)"
                    : "1px solid var(--border)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sync Indicator ──────────────────────────────── */}
      <div className="ml-auto flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        <span className="text-[10px] text-muted-foreground">
          Last sync: {minutesAgo} min ago
        </span>
      </div>
    </div>
  );
}
