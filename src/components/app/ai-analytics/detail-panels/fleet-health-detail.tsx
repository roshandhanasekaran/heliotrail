"use client";

import { useMemo } from "react";
import { FleetHealthGauge } from "@/components/app/ai-analytics/shared/fleet-health-gauge";
import { AreaChart } from "@/components/app/ai-analytics/shared/area-chart";
import { BarChart } from "@/components/app/ai-analytics/shared/bar-chart";
import { HeatmapTable } from "@/components/app/ai-analytics/shared/heatmap-table";
import { ModuleLink } from "@/components/app/ai-analytics/shared/module-link";
import {
  getFleetHealthScore,
  getFleetHealthHistory,
  getFleetBenchmarking,
} from "@/lib/mock/ai-analytics";
import {
  getModuleProfiles,
  getScadaData,
  getAnomalyAlerts,
} from "@/lib/mock/ai-analytics-timeseries";
import type { AnomalyAlert, ModuleProfile } from "@/lib/mock/ai-analytics-timeseries";

interface DetailPanelProps {
  persona?: "manufacturer" | "operator";
  timeRange?: "7d" | "30d" | "90d" | "1y";
  fleetId?: string | null;
  modelFilter?: string;
  onModuleClick?: (moduleId: string) => void;
}

// Module personality lookup for availability calculation
const PERSONALITY_AVAILABILITY: Record<string, number> = {
  connector_fault: 93,
  hotspot: 96,
  batch_defect: 95,
  high_performer: 99,
  normal: 97,
};

// Severity color mapping for alerts
const SEVERITY_COLORS: Record<string, { bg: string; text: string }> = {
  high: { bg: "#FEE2E2", text: "#B91C1C" },
  medium: { bg: "#FEF3C7", text: "#92400E" },
  low: { bg: "var(--muted)", text: "var(--muted-foreground)" },
};

// ─── Fleet-hash helpers ───────────────────────────────────────
function fleetSeed(id: string | null | undefined): number {
  if (!id) return 0.5;
  let h = 5381;
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h + id.charCodeAt(i)) | 0;
  return ((h & 0x7fffffff) % 1000) / 1000;
}
function scaleNum(base: number, seed: number, offset: number): number {
  const s = (Math.floor(seed * 1000) + offset * 137) % 600; // 0..599
  const factor = 0.7 + s / 1000; // 0.7..1.299
  return Math.round(base * factor * 100) / 100;
}
function scaleNumCapped(base: number, seed: number, offset: number): number {
  return Math.min(100, Math.max(0, Math.round(scaleNum(base, seed, offset) * 10) / 10));
}
function combinedSeed(fleetId: string | null | undefined, timeRange: string): number {
  const fs = fleetSeed(fleetId);
  const ts = fleetSeed(timeRange);
  return (fs * 0.7 + ts * 0.3) % 1;
}
function scaleScore(base: number, seed: number, offset: number): number {
  const s = (Math.floor(seed * 1000) + offset * 137) % 200;
  const factor = 0.9 + s / 1000;
  return Math.min(100, Math.max(0, Math.round(base * factor)));
}

// Compute raw heatmap rows from module profiles (fleet-agnostic shape)
function computeHeatmapRows(profiles: ModuleProfile[]) {
  const metricLabels = [
    "PR (%)",
    "Avail (%)",
    "Deg Score",
    "Cleanliness (%)",
    "Temp Health (%)",
  ];

  const rows = profiles.map((profile, moduleIndex) => {
    const scada = getScadaData(moduleIndex);

    const daytimePoints = scada.filter((p) => p.irradiance_poa_wm2 > 50);
    const avgPr =
      daytimePoints.length > 0
        ? (daytimePoints.reduce((s, p) => s + p.performance_ratio, 0) /
            daytimePoints.length) *
          100
        : 0;

    const availability = PERSONALITY_AVAILABILITY[profile.personality] ?? 97;

    const degradationRates: Record<string, number> = {
      hotspot: 0.62,
      batch_defect: 0.55,
      connector_fault: 0.45,
      high_performer: 0.4,
      normal: 0.43,
    };
    const degradationRate = degradationRates[profile.personality] ?? 0.43;
    const degradationScore = Math.max(0, 100 - (degradationRate / 0.7) * 100);

    const soilingBase = 85 + ((moduleIndex * 7) % 13);
    const soiling = Math.min(100, soilingBase);

    const avgModuleTemp =
      daytimePoints.length > 0
        ? daytimePoints.reduce((s, p) => s + p.module_temp_c, 0) /
          daytimePoints.length
        : 40;
    const tempHealth = Math.max(0, 100 - Math.max(0, (avgModuleTemp - 55) * 3));

    return {
      moduleId: profile.id,
      metrics: [
        { label: "PR (%)", value: avgPr },
        { label: "Avail (%)", value: availability },
        { label: "Deg Score", value: degradationScore },
        { label: "Cleanliness (%)", value: soiling },
        { label: "Temp Health (%)", value: tempHealth },
      ],
    };
  });

  return { rows, metricLabels };
}

const noop = () => {};

export function FleetHealthDetail({
  persona = "manufacturer",
  timeRange = "30d",
  fleetId = null,
  modelFilter: _modelFilter = "all",
  onModuleClick = noop,
}: DetailPanelProps = {}) {
  // Fleet + time-range reactive analytics
  const healthScore = useMemo(() => {
    const raw = getFleetHealthScore(fleetId);
    const seed = combinedSeed(fleetId, timeRange);
    return {
      ...raw,
      overall: scaleScore(raw.overall, seed, 50),
      weeklyDelta: Math.round(raw.weeklyDelta * (0.9 + ((Math.floor(seed * 1000) * 200) % 200) / 1000)),
      breakdown: raw.breakdown.map((b, i) => ({ ...b, score: scaleScore(b.score, seed, 51 + i) })),
    };
  }, [fleetId, timeRange]);
  const healthHistory = useMemo(() => getFleetHealthHistory(fleetId), [fleetId]);
  const benchmarks = useMemo(() => getFleetBenchmarking(fleetId), [fleetId]);

  const topModules = benchmarks.slice(0, 3);
  const bottomModules = benchmarks.slice(-3).reverse();

  // Move module profiles / alerts inside component so they participate in React's lifecycle
  const moduleProfiles = useMemo(() => getModuleProfiles(), []);
  const anomalyAlerts = useMemo(() => getAnomalyAlerts(), []);

  // Heatmap: compute raw rows then apply combined (fleet+timeRange) scaling
  const heatmapData = useMemo(() => {
    const raw = computeHeatmapRows(moduleProfiles);
    const seed = combinedSeed(fleetId, timeRange);
    const scaledRows = raw.rows.map((row, rowIdx) => ({
      ...row,
      metrics: row.metrics.map((m, colIdx) => ({
        ...m,
        value: scaleNumCapped(m.value, seed, rowIdx * 5 + colIdx + 10),
      })),
    }));
    return { rows: scaledRows, metricLabels: raw.metricLabels };
  }, [moduleProfiles, fleetId, timeRange]);

  // Anomaly alerts: deterministic fleet+timeRange subset
  const visibleAlerts = useMemo(() => {
    if (anomalyAlerts.length === 0) return [];
    const seed = combinedSeed(fleetId, timeRange);
    const count = Math.max(2, Math.round(seed * anomalyAlerts.length));
    return [...anomalyAlerts]
      .sort((a, b) => {
        const ia = anomalyAlerts.indexOf(a);
        const ib = anomalyAlerts.indexOf(b);
        return ((ia * 31 + Math.floor(seed * 97)) % anomalyAlerts.length) -
               ((ib * 31 + Math.floor(seed * 97)) % anomalyAlerts.length);
      })
      .slice(0, count);
  }, [anomalyAlerts, fleetId, timeRange]);

  // Manufacturer: Quality Score by Model Line — fleet + time-range reactive
  const modelBarData = useMemo(() => {
    if (persona !== "manufacturer") return [];
    const seed = combinedSeed(fleetId, timeRange);
    const modelGroups: Record<string, { totalPr: number; count: number }> = {};
    moduleProfiles.forEach((profile, moduleIndex) => {
      const scada = getScadaData(moduleIndex);
      const daytimePoints = scada.filter((p) => p.irradiance_poa_wm2 > 50);
      const rawPr =
        daytimePoints.length > 0
          ? (daytimePoints.reduce((s, p) => s + p.performance_ratio, 0) /
              daytimePoints.length) *
            100
          : 0;
      // Scale by fleet hash so values differ per fleet
      const avgPr = scaleNumCapped(rawPr, seed, moduleIndex + 20);
      const model = `${profile.model} (${profile.batch})`;
      if (!modelGroups[model]) modelGroups[model] = { totalPr: 0, count: 0 };
      modelGroups[model].totalPr += avgPr;
      modelGroups[model].count++;
    });

    return Object.entries(modelGroups)
      .map(([label, { totalPr, count }]) => ({
        label,
        value: Number((totalPr / count).toFixed(1)),
        color:
          totalPr / count >= 82
            ? "#22C55E"
            : totalPr / count >= 78
              ? "#F59E0B"
              : "#EF4444",
      }))
      .sort((a, b) => b.value - a.value);
  }, [persona, moduleProfiles, fleetId, timeRange]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-foreground uppercase tracking-wider">
          Fleet Health
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Composite health score with trend analysis and fleet ranking breakdown.
        </p>
      </div>

      {/* Hero: Gauge + Score */}
      <div className="border border-dashed border-border bg-card p-6">
        <div className="flex items-center gap-8 flex-wrap">
          <div className="scale-[1.4] origin-center ml-4">
            <FleetHealthGauge
              score={healthScore.overall}
              delta={healthScore.weeklyDelta}
              breakdown={healthScore.breakdown}
            />
          </div>
          <div className="flex-1 min-w-[200px] ml-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Overall Fleet Health
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="font-mono text-5xl font-bold text-foreground">
                {healthScore.overall}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="font-mono text-sm font-bold"
                style={{
                  color: healthScore.weeklyDelta >= 0 ? "#22C55E" : "#EF4444",
                }}
              >
                {healthScore.weeklyDelta >= 0 ? "+" : ""}
                {healthScore.weeklyDelta}
              </span>
              <span className="text-[10px] text-muted-foreground/70">
                vs last week
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Bars */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Score Breakdown
        </h2>
        <div className="border border-dashed border-border bg-card p-5 space-y-3">
          {healthScore.breakdown.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="w-32 text-[11px] text-muted-foreground truncate">
                {b.label}
              </span>
              <div className="flex-1 h-2.5 bg-muted relative">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${b.score}%`,
                    backgroundColor: b.color,
                  }}
                />
              </div>
              <span className="w-8 text-right font-mono text-xs font-bold text-foreground">
                {b.score}
              </span>
              <span
                className="w-16 text-center px-1.5 py-0.5 text-[8px] font-bold uppercase"
                style={{
                  backgroundColor:
                    b.status === "good"
                      ? "var(--passport-green-muted)"
                      : b.status === "warning"
                        ? "#FEF3C7"
                        : "#FEE2E2",
                  color:
                    b.status === "good"
                      ? "var(--foreground)"
                      : b.status === "warning"
                        ? "#92400E"
                        : "#B91C1C",
                }}
              >
                {b.status}
              </span>
              <span className="w-10 text-right font-mono text-[9px] text-muted-foreground/70">
                {(b.weight * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Heatmap Table */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Module Health Matrix
        </h2>
        <div className="border border-dashed border-border bg-card p-5">
          <HeatmapTable
            rows={heatmapData.rows}
            metricLabels={heatmapData.metricLabels}
            greenThreshold={85}
            yellowThreshold={70}
            onModuleClick={onModuleClick}
          />
        </div>
      </section>

      {/* Health Trend */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          8-Week Health Trend
        </h2>
        <div className="border border-dashed border-border bg-card p-5">
          <AreaChart
            data={healthHistory.map((h) => h.score)}
            height={180}
            color="#22C55E"
            xLabels={healthHistory.map((h) => h.week)}
            yMin={85}
            yMax={93}
          />
        </div>
      </section>

      {/* Fleet Ranking Snapshot */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Fleet Ranking Snapshot
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Top performers */}
          <div>
            <p className="text-[9px] uppercase tracking-wider font-semibold text-primary mb-2">
              Top Performers
            </p>
            <div className="space-y-2">
              {topModules.map((m) => (
                <div
                  key={m.moduleId}
                  className="border border-dashed border-border bg-card p-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="font-mono text-[10px] font-bold text-foreground">
                      #{m.rank}
                    </span>
                    <span className="ml-2">
                      <ModuleLink moduleId={m.moduleId} onClick={onModuleClick} />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {m.pr}%
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-primary">
                      +{m.delta}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom performers */}
          <div>
            <p className="text-[9px] uppercase tracking-wider font-semibold text-[#EF4444] mb-2">
              Needs Attention
            </p>
            <div className="space-y-2">
              {bottomModules.map((m) => (
                <div
                  key={m.moduleId}
                  className="border border-dashed border-border bg-card p-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="font-mono text-[10px] font-bold text-foreground">
                      #{m.rank}
                    </span>
                    <span className="ml-2">
                      <ModuleLink moduleId={m.moduleId} onClick={onModuleClick} />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {m.pr}%
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-[#EF4444]">
                      {m.delta}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturer: Quality Score by Model Line */}
      {persona === "manufacturer" && modelBarData.length > 0 && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Quality Score by Model Line
          </h2>
          <div className="border border-dashed border-border bg-card p-5">
            <BarChart
              bars={modelBarData}
              maxValue={100}
              baselineValue={80}
              baselineLabel="Target PR 80%"
              showValues
              valueSuffix="%"
              barHeight={24}
            />
          </div>
        </section>
      )}

      {/* Operator: Active Alert Timeline */}
      {persona === "operator" && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Active Alert Timeline
          </h2>
          <div className="border border-dashed border-border bg-card p-5 space-y-3">
            {visibleAlerts.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active alerts.</p>
            ) : (
              visibleAlerts.map((alert: AnomalyAlert) => {
                const colors = SEVERITY_COLORS[alert.severity] ?? SEVERITY_COLORS.low!;
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 border-l-2 pl-3"
                    style={{ borderColor: colors.text }}
                  >
                    <div className="shrink-0 mt-0.5">
                      <span
                        className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] font-semibold text-foreground truncate">
                          {alert.pattern}
                        </p>
                        <span className="font-mono text-[9px] text-muted-foreground/70 shrink-0">
                          {alert.confidence_pct}% conf.
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ModuleLink
                          moduleId={alert.module_id}
                          onClick={onModuleClick}
                          className="text-[9px]"
                        />
                        <span className="text-[8px] text-muted-foreground/70">
                          {alert.detected_at}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Weight Methodology */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Score Methodology
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-border text-xs">
            <thead>
              <tr className="bg-muted">
                {["Category", "Weight", "Score", "Weighted"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {healthScore.breakdown.map((b, i) => (
                <tr
                  key={b.label}
                  className={i % 2 === 1 ? "bg-muted/50" : "bg-card"}
                >
                  <td className="px-3 py-2 text-foreground">{b.label}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">
                    {(b.weight * 100).toFixed(0)}%
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold text-foreground">
                    {b.score}
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold" style={{ color: b.color }}>
                    {(b.score * b.weight).toFixed(1)}
                  </td>
                </tr>
              ))}
              <tr className="bg-muted font-bold">
                <td className="px-3 py-2 text-foreground">Total</td>
                <td className="px-3 py-2 font-mono text-muted-foreground">100%</td>
                <td className="px-3 py-2" />
                <td className="px-3 py-2 font-mono text-primary">
                  {healthScore.overall}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
