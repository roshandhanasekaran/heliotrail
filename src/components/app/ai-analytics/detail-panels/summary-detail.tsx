"use client";

import { useState, useEffect, useId, useMemo } from "react";
import { Sun, Thermometer, Wind, Droplets, Activity } from "lucide-react";
import {
  AreaChart as RAreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FleetHealthGauge } from "@/components/app/ai-analytics/shared/fleet-health-gauge";
import { AnomalyCard } from "@/components/app/ai-analytics/shared/anomaly-card";
import { ModuleLink } from "@/components/app/ai-analytics/shared/module-link";
import {
  getFleetHealthScore,
  getAnomalyStream,
  getFleetBenchmarking,
  getWarrantyIntelligence,
  getCarbonOptimization,
} from "@/lib/mock/ai-analytics";
import {
  getFleetScadaSummary,
  getWeatherData,
} from "@/lib/mock/ai-analytics-timeseries";

import type { FleetOption } from "@/lib/ai-analytics-types";

interface DetailPanelProps {
  persona?: "manufacturer" | "operator";
  timeRange?: "7d" | "30d" | "90d" | "1y";
  fleetId?: string | null;
  fleetOptions?: FleetOption[];
  modelFilter?: string;
  onModuleClick?: (moduleId: string) => void;
}

// ─── Base time-series data (generated once — expensive, fleet-independent shape) ─
const _fleetSummary = getFleetScadaSummary();
const _weatherData = getWeatherData();

// Find best midday SCADA snapshot
function findMiddayScada(summary: typeof _fleetSummary) {
  const midday = summary.find((p) => {
    const hour = new Date(p.timestamp).getHours();
    return hour >= 11 && hour <= 14 && p.avg_irradiance > 400;
  });
  if (midday) return midday;
  const daytime = summary.find((p) => p.total_power_kw > 1);
  return daytime ?? summary[Math.floor(summary.length / 2)]!;
}

// Find best midday weather snapshot
function findMiddayWeather(weather: typeof _weatherData) {
  const midday = weather.find((w) => {
    const hour = new Date(w.timestamp).getHours();
    return hour >= 11 && hour <= 14 && w.ghi_wm2 > 400;
  });
  return midday ?? weather[Math.floor(weather.length / 2)]!;
}

// Compute best-day sparkline from fleet summary
function computeSparkline(summary: typeof _fleetSummary) {
  const byDate: Record<string, typeof summary> = {};
  for (const pt of summary) {
    const date = pt.timestamp.slice(0, 10);
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(pt);
  }
  let bestDate = "";
  let bestTotal = 0;
  for (const [date, points] of Object.entries(byDate)) {
    const total = points.reduce((s, p) => s + p.total_power_kw, 0);
    if (total > bestTotal) { bestTotal = total; bestDate = date; }
  }
  const dayPoints = byDate[bestDate] ?? summary.slice(0, 96);
  return dayPoints
    .filter((p) => { const hour = new Date(p.timestamp).getHours(); return hour >= 6 && hour <= 20; })
    .map((p) => ({ time: new Date(p.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), power: Number(p.total_power_kw.toFixed(2)) }));
}

// Pre-compute base values (fleet-agnostic)
const _middayScada = findMiddayScada(_fleetSummary);
const _middayWeather = findMiddayWeather(_weatherData);
const _sparklineData = computeSparkline(_fleetSummary);

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
// Blend fleet + time-range into a single seed so each combination produces distinct values
function combinedSeed(fleetId: string | null | undefined, timeRange: string): number {
  const fs = fleetSeed(fleetId);
  const ts = fleetSeed(timeRange);
  return (fs * 0.7 + ts * 0.3) % 1;
}
// Smaller ±10% scale for health-adjacent numbers (scores stay plausible)
function scaleScore(base: number, seed: number, offset: number): number {
  const s = (Math.floor(seed * 1000) + offset * 137) % 200; // 0..199
  const factor = 0.9 + s / 1000; // 0.9..1.099
  return Math.min(100, Math.max(0, Math.round(base * factor)));
}

const noop = () => {};

export function SummaryDetail({
  persona: _persona = "manufacturer",
  timeRange = "30d",
  fleetId = null,
  fleetOptions = [],
  modelFilter: _modelFilter = "all",
  onModuleClick = noop,
}: DetailPanelProps = {}) {
  const selectedFleet = fleetId ? fleetOptions.find((f) => f.id === fleetId) : null;
  const siteLabel = selectedFleet
    ? `${selectedFleet.city}, ${selectedFleet.country} — ${selectedFleet.name}`
    : "All Sites — Aggregated View";

  // Fleet + time-range reactive analytics data
  const healthScore = useMemo(() => {
    const raw = getFleetHealthScore(fleetId);
    const seed = combinedSeed(fleetId, timeRange);
    return {
      ...raw,
      overall: scaleScore(raw.overall, seed, 50),
      weeklyDelta: Math.round(raw.weeklyDelta * (0.9 + (seed * 200 % 200) / 1000)),
      breakdown: raw.breakdown.map((b, i) => ({
        ...b,
        score: scaleScore(b.score, seed, 51 + i),
      })),
    };
  }, [fleetId, timeRange]);
  const anomalies = useMemo(() => getAnomalyStream(fleetId), [fleetId]);
  const benchmarks = useMemo(() => getFleetBenchmarking(fleetId), [fleetId]);
  const warranty = useMemo(() => getWarrantyIntelligence(fleetId), [fleetId]);
  const carbon = useMemo(() => getCarbonOptimization(fleetId), [fleetId]);

  // Fleet + time-range reactive SCADA / weather values
  const baseScada = useMemo(() => {
    const seed = combinedSeed(fleetId, timeRange);
    return {
      power: scaleNum(_middayScada.total_power_kw, seed, 5),
      pr: scaleNum(_middayScada.avg_pr, seed, 6),
      irradiance: scaleNum(_middayScada.avg_irradiance, seed, 7),
    };
  }, [fleetId, timeRange]);

  const weatherValues = useMemo(() => {
    const seed = combinedSeed(fleetId, timeRange);
    return {
      ghi: Math.round(scaleNum(_middayWeather.ghi_wm2, seed, 1)),
      temp: Math.round(scaleNum(_middayWeather.ambient_temp_c, seed, 2) * 10) / 10,
      wind: Math.round(scaleNum(_middayWeather.wind_speed_ms, seed, 3) * 10) / 10,
      humidity: Math.min(99, Math.max(10, Math.round(scaleNum(_middayWeather.humidity_pct, seed, 4)))),
    };
  }, [fleetId, timeRange]);

  const KPI_CARDS = useMemo(() => [
    { label: "Fleet PR", value: `${(baseScada.pr * 100).toFixed(1)}%`, sub: "Performance Ratio", color: "#F59E0B" },
    { label: "Active Alerts", value: String(anomalies.filter((a) => !a.resolved).length), sub: "Unresolved anomalies", color: "#EF4444" },
    { label: "Warranty Claims Ready", value: String(warranty.claimReady.length), sub: `EUR ${warranty.claimReady.reduce((s, c) => s + c.estimatedClaimValueEur, 0).toLocaleString("en-US")}`, color: "#F59E0B" },
    { label: "Carbon Avg", value: `${carbon.currentAvgKgCO2e}`, sub: `kg CO2e (benchmark ${carbon.industryBenchmark})`, color: carbon.currentAvgKgCO2e > carbon.industryBenchmark ? "#F59E0B" : "#22C55E" },
  ], [baseScada.pr, anomalies, warranty, carbon]);

  const topAlerts = anomalies.filter((a) => !a.resolved).slice(0, 3);
  const topBenchmarks = benchmarks.slice(0, 5);

  // Live fleet power ticker — resets when fleet changes, then applies jitter
  const [livePower, setLivePower] = useState(baseScada.power);
  const [livePr, setLivePr] = useState(baseScada.pr);
  const [liveIrradiance, setLiveIrradiance] = useState(baseScada.irradiance);

  useEffect(() => {
    setLivePower(baseScada.power);
    setLivePr(baseScada.pr);
    setLiveIrradiance(baseScada.irradiance);
    const interval = setInterval(() => {
      const jitter = () => 1 + (Math.random() - 0.5) * 0.04;
      setLivePower(Number((baseScada.power * jitter()).toFixed(1)));
      setLivePr(Number((baseScada.pr * jitter()).toFixed(4)));
      setLiveIrradiance(Number((baseScada.irradiance * jitter()).toFixed(1)));
    }, 5000);
    return () => clearInterval(interval);
  }, [baseScada]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-bold text-foreground uppercase tracking-wider">
          AI Analytics Overview
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Fleet-wide intelligence summary. Select a section in the sidebar for detailed analysis.
        </p>
      </div>

      {/* Live Fleet Power + Site Conditions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Live Fleet Power Ticker */}
        <div className="border border-dashed border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
              Live
            </span>
            <Activity className="h-3 w-3 text-primary ml-auto" />
          </div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Fleet Power Output
          </p>
          <p className="font-mono text-4xl font-bold text-foreground mt-1">
            {livePower.toFixed(1)}{" "}
            <span className="text-lg text-muted-foreground">kW</span>
          </p>
          {/* Mini sparkline area chart — today's power curve */}
          <div className="mt-3 -mx-1" style={{ height: 80 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RAreaChart data={_sparklineData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Tooltip
                  cursor={{ stroke: "#22C55E", strokeWidth: 1, strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "var(--foreground)",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 11,
                    color: "var(--card)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    padding: "6px 10px",
                  }}
                  labelStyle={{ color: "var(--muted-foreground)", fontSize: 10, marginBottom: 2 }}
                  formatter={(value: any) => [`${Number(value).toFixed(1)} kW`, "Fleet Power"]}
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#22C55E"
                  strokeWidth={1.5}
                  fill="url(#sparklineFill)"
                  dot={false}
                  activeDot={{ r: 3, fill: "#22C55E", stroke: "var(--card)", strokeWidth: 1.5 }}
                />
              </RAreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-2">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Avg PR</p>
              <p className="font-mono text-sm font-bold text-primary">
                {(livePr * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Irradiance</p>
              <p className="font-mono text-sm font-bold text-[#F59E0B]">
                {liveIrradiance.toFixed(0)} W/m²
              </p>
            </div>
          </div>
        </div>

        {/* Site Conditions — fleet-reactive */}
        <div className="border border-dashed border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
              Site Conditions
            </p>
            <span className="text-[9px] text-muted-foreground/70 bg-muted px-2 py-0.5">
              {siteLabel}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-[#F59E0B] shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">GHI Irradiance</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {weatherValues.ghi} <span className="text-[10px] text-muted-foreground font-normal">W/m²</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Thermometer className="h-5 w-5 text-[#EF4444] shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Ambient Temp</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {weatherValues.temp.toFixed(1)} <span className="text-[10px] text-muted-foreground font-normal">°C</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="h-5 w-5 text-[#3B82F6] shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Wind Speed</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {weatherValues.wind.toFixed(1)} <span className="text-[10px] text-muted-foreground font-normal">m/s</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-[#06B6D4] shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Humidity</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {weatherValues.humidity} <span className="text-[10px] text-muted-foreground font-normal">%</span>
                </p>
              </div>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/70 mt-3 italic">
            {selectedFleet
              ? `Conditions shown for ${selectedFleet.name} (${selectedFleet.climate} climate zone).`
              : "Conditions shown as weighted average across all fleet sites."}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.label}
            className="border border-dashed border-border bg-muted p-4 cursor-pointer hover:bg-border transition-colors"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {kpi.label}
            </p>
            <p
              className="font-mono text-2xl font-bold mt-1"
              style={{ color: kpi.color }}
            >
              {kpi.value}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Fleet Health Gauge (larger, centered) */}
      <div className="flex flex-col items-center border border-dashed border-border bg-card p-6">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
          Fleet Health Composite
        </p>
        <div className="scale-150 origin-center">
          <FleetHealthGauge
            score={healthScore.overall}
            delta={healthScore.weeklyDelta}
            breakdown={healthScore.breakdown}
          />
        </div>
        <div className="mt-10 w-full max-w-md space-y-2">
          {healthScore.breakdown.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="w-28 text-[10px] text-muted-foreground truncate">
                {b.label}
              </span>
              <div className="flex-1 h-1.5 bg-muted">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${b.score}%`, backgroundColor: b.color }}
                />
              </div>
              <span className="w-8 text-right font-mono text-[10px] font-semibold text-foreground">
                {b.score}
              </span>
              <span
                className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
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
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Alerts */}
      <div>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Top Alerts
        </h2>
        <div className="space-y-2">
          {topAlerts.map((anomaly) => (
            <div
              key={anomaly.id}
              className="border border-dashed border-border bg-card"
            >
              <AnomalyCard anomaly={anomaly} />
              {anomaly.module && (
                <div className="px-2.5 pb-2">
                  <ModuleLink
                    moduleId={anomaly.module}
                    onClick={onModuleClick}
                    className="text-[9px]"
                  />
                  <span className="text-[9px] text-muted-foreground ml-1">&rarr;</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Fleet Benchmarking Preview */}
      <div>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Fleet Benchmarking - Top 5
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-border text-xs">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Rank
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Module ID
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  PR%
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Delta
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {topBenchmarks.map((m, i) => (
                <tr
                  key={m.moduleId}
                  className={i % 2 === 1 ? "bg-muted/50" : "bg-card"}
                >
                  <td className="px-3 py-2 font-mono text-foreground">
                    {m.rank}
                  </td>
                  <td className="px-3 py-2">
                    <ModuleLink moduleId={m.moduleId} onClick={onModuleClick} />
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold text-foreground">
                    {m.pr}%
                  </td>
                  <td
                    className="px-3 py-2 font-mono font-semibold"
                    style={{
                      color:
                        m.delta > 0
                          ? "#22C55E"
                          : m.delta < 0
                            ? "#EF4444"
                            : "var(--muted-foreground)",
                    }}
                  >
                    {m.delta > 0 ? "+" : ""}
                    {m.delta}%
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
                      style={{
                        backgroundColor:
                          m.status === "outperforming"
                            ? "var(--passport-green-muted)"
                            : m.status === "normal"
                              ? "var(--muted)"
                              : "#FEE2E2",
                        color:
                          m.status === "outperforming"
                            ? "var(--foreground)"
                            : m.status === "normal"
                              ? "var(--muted-foreground)"
                              : "#B91C1C",
                      }}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
