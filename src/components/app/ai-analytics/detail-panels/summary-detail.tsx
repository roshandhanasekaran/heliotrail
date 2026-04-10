"use client";

import { useState, useEffect, useId } from "react";
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

interface DetailPanelProps {
  persona?: "manufacturer" | "operator";
  timeRange?: "7d" | "30d" | "90d" | "1y";
  modelFilter?: string;
  onModuleClick?: (moduleId: string) => void;
}

const healthScore = getFleetHealthScore();
const anomalies = getAnomalyStream();
const benchmarks = getFleetBenchmarking();
const warranty = getWarrantyIntelligence();
const carbon = getCarbonOptimization();

// Pick a realistic midday data point (not last point which may be nighttime)
const fleetSummary = getFleetScadaSummary();
const middayScada = (() => {
  // Find a point near solar noon (12:00-14:00) with good irradiance
  const midday = fleetSummary.find(
    (p) => {
      const hour = new Date(p.timestamp).getHours();
      return hour >= 11 && hour <= 14 && p.avg_irradiance > 400;
    }
  );
  // Fallback: find any daytime point with decent output
  if (midday) return midday;
  const daytime = fleetSummary.find((p) => p.total_power_kw > 1);
  return daytime ?? fleetSummary[Math.floor(fleetSummary.length / 2)]!;
})();

// Get a midday weather data point (consistent with power reading)
const weatherData = getWeatherData();
const middayWeather = (() => {
  const midday = weatherData.find((w) => {
    const hour = new Date(w.timestamp).getHours();
    return hour >= 11 && hour <= 14 && w.ghi_wm2 > 400;
  });
  return midday ?? weatherData[Math.floor(weatherData.length / 2)]!;
})();

// Compute sparkline data — one representative day's power curve (daytime hours only)
const sparklineData = (() => {
  // Group data by date, pick a day with good solar output
  const byDate: Record<string, typeof fleetSummary> = {};
  for (const pt of fleetSummary) {
    const date = pt.timestamp.slice(0, 10);
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(pt);
  }
  // Pick the day with highest total power (best solar day)
  let bestDate = "";
  let bestTotal = 0;
  for (const [date, points] of Object.entries(byDate)) {
    const total = points.reduce((s, p) => s + p.total_power_kw, 0);
    if (total > bestTotal) {
      bestTotal = total;
      bestDate = date;
    }
  }
  const dayPoints = byDate[bestDate] ?? fleetSummary.slice(0, 96);
  // Filter to daytime (6:00-20:00) and map to chart format
  return dayPoints
    .filter((p) => {
      const hour = new Date(p.timestamp).getHours();
      return hour >= 6 && hour <= 20;
    })
    .map((p) => ({
      time: new Date(p.timestamp).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      power: Number(p.total_power_kw.toFixed(2)),
    }));
})();

const KPI_CARDS = [
  {
    label: "Fleet PR",
    value: "81.4%",
    sub: "Performance Ratio",
    color: "#F59E0B",
  },
  {
    label: "Active Alerts",
    value: String(anomalies.filter((a) => !a.resolved).length),
    sub: "Unresolved anomalies",
    color: "#EF4444",
  },
  {
    label: "Warranty Claims Ready",
    value: String(warranty.claimReady.length),
    sub: `EUR ${warranty.claimReady.reduce((s, c) => s + c.estimatedClaimValueEur, 0).toLocaleString("en-US")}`,
    color: "#F59E0B",
  },
  {
    label: "Carbon Avg",
    value: `${carbon.currentAvgKgCO2e}`,
    sub: `kg CO2e (benchmark ${carbon.industryBenchmark})`,
    color: carbon.currentAvgKgCO2e > carbon.industryBenchmark ? "#F59E0B" : "#22C55E",
  },
];

const noop = () => {};

export function SummaryDetail({
  persona: _persona = "manufacturer",
  timeRange: _timeRange = "30d",
  modelFilter: _modelFilter = "all",
  onModuleClick = noop,
}: DetailPanelProps = {}) {
  const topAlerts = anomalies.filter((a) => !a.resolved).slice(0, 3);
  const topBenchmarks = benchmarks.slice(0, 5);

  // Live fleet power ticker with jitter — uses midday snapshot for realistic values
  const [livePower, setLivePower] = useState(middayScada.total_power_kw);
  const [livePr, setLivePr] = useState(middayScada.avg_pr);
  const [liveIrradiance, setLiveIrradiance] = useState(middayScada.avg_irradiance);

  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = () => 1 + (Math.random() - 0.5) * 0.04;
      setLivePower(Number((middayScada.total_power_kw * jitter()).toFixed(1)));
      setLivePr(Number((middayScada.avg_pr * jitter()).toFixed(4)));
      setLiveIrradiance(Number((middayScada.avg_irradiance * jitter()).toFixed(1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-bold text-[#0D0D0D] uppercase tracking-wider">
          AI Analytics Overview
        </h1>
        <p className="text-xs text-[#737373] mt-1">
          Fleet-wide intelligence summary. Select a section in the sidebar for detailed analysis.
        </p>
      </div>

      {/* Live Fleet Power + Site Conditions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Live Fleet Power Ticker */}
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]" />
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#22C55E]">
              Live
            </span>
            <Activity className="h-3 w-3 text-[#22C55E] ml-auto" />
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#737373]">
            Fleet Power Output
          </p>
          <p className="font-mono text-4xl font-bold text-[#0D0D0D] mt-1">
            {livePower.toFixed(1)}{" "}
            <span className="text-lg text-[#737373]">kW</span>
          </p>
          {/* Mini sparkline area chart — today's power curve */}
          <div className="mt-3 -mx-1" style={{ height: 80 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RAreaChart data={sparklineData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Tooltip
                  cursor={{ stroke: "#22C55E", strokeWidth: 1, strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "#0D0D0D",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 11,
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    padding: "6px 10px",
                  }}
                  labelStyle={{ color: "#A3A3A3", fontSize: 10, marginBottom: 2 }}
                  formatter={(value: any) => [`${Number(value).toFixed(1)} kW`, "Fleet Power"]}
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#22C55E"
                  strokeWidth={1.5}
                  fill="url(#sparklineFill)"
                  dot={false}
                  activeDot={{ r: 3, fill: "#22C55E", stroke: "#fff", strokeWidth: 1.5 }}
                />
              </RAreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-2">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#737373]">Avg PR</p>
              <p className="font-mono text-sm font-bold text-[#22C55E]">
                {(livePr * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#737373]">Irradiance</p>
              <p className="font-mono text-sm font-bold text-[#F59E0B]">
                {liveIrradiance.toFixed(0)} W/m²
              </p>
            </div>
          </div>
        </div>

        {/* Site Conditions — contextualized for fleet location */}
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373]">
              Site Conditions
            </p>
            <span className="text-[9px] text-[#A3A3A3] bg-[#F2F2F2] px-2 py-0.5">
              Seville, Spain — Primary Site
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-[#F59E0B] shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-[#737373]">GHI Irradiance</p>
                <p className="font-mono text-sm font-bold text-[#0D0D0D]">
                  {middayWeather.ghi_wm2.toFixed(0)} <span className="text-[10px] text-[#737373] font-normal">W/m²</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Thermometer className="h-5 w-5 text-[#EF4444] shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-[#737373]">Ambient Temp</p>
                <p className="font-mono text-sm font-bold text-[#0D0D0D]">
                  {middayWeather.humidity_pct > 0 ? (18 + middayWeather.ghi_wm2 * 0.012).toFixed(1) : "18.2"} <span className="text-[10px] text-[#737373] font-normal">°C</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="h-5 w-5 text-[#3B82F6] shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-[#737373]">Wind Speed</p>
                <p className="font-mono text-sm font-bold text-[#0D0D0D]">
                  {middayWeather.wind_speed_ms.toFixed(1)} <span className="text-[10px] text-[#737373] font-normal">m/s</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-[#06B6D4] shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-[#737373]">Humidity</p>
                <p className="font-mono text-sm font-bold text-[#0D0D0D]">
                  {middayWeather.humidity_pct.toFixed(0)} <span className="text-[10px] text-[#737373] font-normal">%</span>
                </p>
              </div>
            </div>
          </div>
          <p className="text-[8px] text-[#A3A3A3] mt-3 italic">
            Conditions shown for primary fleet site. Multi-site fleets show weighted average.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.label}
            className="border border-dashed border-[#D9D9D9] bg-[#F2F2F2] p-4 cursor-pointer hover:bg-[#E5E5E5] transition-colors"
          >
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">
              {kpi.label}
            </p>
            <p
              className="font-mono text-2xl font-bold mt-1"
              style={{ color: kpi.color }}
            >
              {kpi.value}
            </p>
            <p className="text-[10px] text-[#A3A3A3] mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Fleet Health Gauge (larger, centered) */}
      <div className="flex flex-col items-center border border-dashed border-[#D9D9D9] bg-white p-6">
        <p className="text-[10px] uppercase tracking-wider text-[#737373] mb-4">
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
              <span className="w-28 text-[10px] text-[#737373] truncate">
                {b.label}
              </span>
              <div className="flex-1 h-1.5 bg-[#F2F2F2]">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${b.score}%`, backgroundColor: b.color }}
                />
              </div>
              <span className="w-8 text-right font-mono text-[10px] font-semibold text-[#0D0D0D]">
                {b.score}
              </span>
              <span
                className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
                style={{
                  backgroundColor:
                    b.status === "good"
                      ? "#DCFCE7"
                      : b.status === "warning"
                        ? "#FEF3C7"
                        : "#FEE2E2",
                  color:
                    b.status === "good"
                      ? "#166534"
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
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Top Alerts
        </h2>
        <div className="space-y-2">
          {topAlerts.map((anomaly) => (
            <div
              key={anomaly.id}
              className="border border-dashed border-[#D9D9D9] bg-white"
            >
              <AnomalyCard anomaly={anomaly} />
              {anomaly.module && (
                <div className="px-2.5 pb-2">
                  <ModuleLink
                    moduleId={anomaly.module}
                    onClick={onModuleClick}
                    className="text-[9px]"
                  />
                  <span className="text-[9px] text-[#737373] ml-1">&rarr;</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Fleet Benchmarking Preview */}
      <div>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Fleet Benchmarking - Top 5
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[#D9D9D9] text-xs">
            <thead>
              <tr className="bg-[#F2F2F2]">
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Rank
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Module ID
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  PR%
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Delta
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {topBenchmarks.map((m, i) => (
                <tr
                  key={m.moduleId}
                  className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
                >
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {m.rank}
                  </td>
                  <td className="px-3 py-2">
                    <ModuleLink moduleId={m.moduleId} onClick={onModuleClick} />
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold text-[#0D0D0D]">
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
                            : "#737373",
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
                            ? "#DCFCE7"
                            : m.status === "normal"
                              ? "#F3F4F6"
                              : "#FEE2E2",
                        color:
                          m.status === "outperforming"
                            ? "#166534"
                            : m.status === "normal"
                              ? "#6B7280"
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
