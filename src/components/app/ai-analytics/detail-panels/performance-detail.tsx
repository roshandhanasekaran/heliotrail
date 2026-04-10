"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Sun, Cloud, CloudSun } from "lucide-react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  Cell,
  Legend,
} from "recharts";
import { AreaChart } from "@/components/app/ai-analytics/shared/area-chart";
import { DualLineChart } from "@/components/app/ai-analytics/shared/dual-line-chart";
import { BarChart } from "@/components/app/ai-analytics/shared/bar-chart";
import { ModuleLink } from "@/components/app/ai-analytics/shared/module-link";
import {
  getFleetBenchmarking,
  getPerformanceForecast,
  type FleetBenchmark,
} from "@/lib/mock/ai-analytics";
import {
  getModuleProfiles,
  getScadaData,
  getWeatherData,
  getFinancialData,
  getFleetScadaSummary,
  getFleetFinancialSummary,
} from "@/lib/mock/ai-analytics-timeseries";
import type { ModuleProfile } from "@/lib/mock/ai-analytics-timeseries";

/* ─── Props ─── */

interface PerformanceDetailProps {
  persona?: "manufacturer" | "operator";
  timeRange?: "7d" | "30d" | "90d" | "1y";
  modelFilter?: string;
  onModuleClick?: (moduleId: string) => void;
}

const TIME_RANGE_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

const CHART_TOOLTIP_STYLE = {
  background: "#fff",
  border: "1px dashed #D9D9D9",
  borderRadius: 0,
  fontSize: 11,
  fontFamily: "JetBrains Mono, monospace",
  padding: "8px 12px",
};

const PERSONALITY_COLORS: Record<string, string> = {
  high_performer: "#22C55E",
  hotspot: "#EF4444",
  batch_defect: "#EF4444",
  connector_fault: "#F59E0B",
  normal: "#737373",
};

const benchmarks = getFleetBenchmarking();
const forecast = getPerformanceForecast();

type SortKey = "rank" | "pr";

export function PerformanceDetail({
  persona = "manufacturer",
  timeRange = "30d",
  modelFilter = "all",
  onModuleClick = () => {},
}: PerformanceDetailProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);

  const days = TIME_RANGE_DAYS[timeRange] ?? 30;

  /* ─── Time-series data ─── */
  const fleetScada = useMemo(() => getFleetScadaSummary(days), [days]);
  const fleetFinancial = useMemo(() => getFleetFinancialSummary(days), [days]);
  const weatherData = useMemo(() => getWeatherData(days), [days]);
  const moduleProfiles = useMemo(() => getModuleProfiles(), []);

  /* ─── Forecast chart data (daily aggregation for Recharts AreaChart) ─── */
  const forecastChartData = useMemo(() => {
    // Aggregate 15-min SCADA data to daily
    const intervalsPerDay = 96;
    const dailyData: { date: string; avgPR: number; totalPower: number; avgIrradiance: number }[] = [];
    const totalDays = Math.floor(fleetScada.length / intervalsPerDay);

    for (let d = 0; d < totalDays; d++) {
      const start = d * intervalsPerDay;
      const end = start + intervalsPerDay;
      const daySlice = fleetScada.slice(start, end);

      let prSum = 0;
      let prCount = 0;
      let totalPower = 0;
      let irrSum = 0;
      let irrCount = 0;

      for (const pt of daySlice) {
        totalPower += pt.total_power_kw * 0.25; // kWh per 15-min interval
        if (pt.avg_pr > 0) {
          prSum += pt.avg_pr;
          prCount++;
        }
        if (pt.avg_irradiance > 0) {
          irrSum += pt.avg_irradiance;
          irrCount++;
        }
      }

      const ts = new Date(daySlice[0]!.timestamp);
      dailyData.push({
        date: `${ts.getMonth() + 1}/${ts.getDate()}`,
        avgPR: prCount > 0 ? Math.round((prSum / prCount) * 1000) / 10 : 0,
        totalPower: Math.round(totalPower * 100) / 100,
        avgIrradiance: irrCount > 0 ? Math.round(irrSum / irrCount) : 0,
      });
    }
    return dailyData;
  }, [fleetScada]);

  /* ─── Daily energy yield data ─── */
  const energyYieldData = useMemo(() => {
    // Expected yield: use average of actual yield * 1.05 as a simple proxy
    const avgYield = fleetFinancial.reduce((s, d) => s + d.energy_yield_kwh, 0) / fleetFinancial.length;
    const expectedYield = avgYield * 1.05;

    // Correlate weather data to add cloud indication
    const hoursPerDay = 24;
    return fleetFinancial.map((fp, i) => {
      // Get mid-day weather for cloud indicator
      const weatherIdx = i * hoursPerDay + 12; // noon
      const wp = weatherData[weatherIdx];
      const cloudCover = wp?.cloud_cover_pct ?? 30;

      return {
        date: fp.date.slice(5), // MM-DD
        actual: Math.round(fp.energy_yield_kwh * 100) / 100,
        expected: Math.round(expectedYield * 100) / 100,
        weather: cloudCover < 25 ? "sun" : cloudCover < 60 ? "partial" : "cloud",
      };
    });
  }, [fleetFinancial, weatherData]);

  /* ─── PR vs Irradiance scatter data ─── */
  const scatterData = useMemo(() => {
    return moduleProfiles.map((profile, idx) => {
      const scada = getScadaData(idx, days);
      // Compute average PR and irradiance (daytime only)
      let prSum = 0;
      let prCount = 0;
      let irrSum = 0;
      let irrCount = 0;

      for (const pt of scada) {
        if (pt.performance_ratio > 0 && pt.irradiance_poa_wm2 > 50) {
          prSum += pt.performance_ratio;
          prCount++;
          irrSum += pt.irradiance_poa_wm2;
          irrCount++;
        }
      }

      return {
        moduleId: profile.id,
        model: profile.model,
        personality: profile.personality,
        avgPR: prCount > 0 ? Math.round((prSum / prCount) * 1000) / 10 : 0,
        avgIrradiance: irrCount > 0 ? Math.round(irrSum / irrCount) : 0,
      };
    });
  }, [moduleProfiles, days]);

  // Filter scatter data by model
  const filteredScatterData = useMemo(() => {
    if (modelFilter === "all") return scatterData;
    return scatterData.filter((d) => d.model === modelFilter);
  }, [scatterData, modelFilter]);

  /* ─── Model vs Datasheet data (manufacturer persona) ─── */
  const modelDatasheetData = useMemo(() => {
    if (persona !== "manufacturer") return [];
    const modelMap: Record<string, { prSum: number; count: number }> = {};

    moduleProfiles.forEach((profile, idx) => {
      const scada = getScadaData(idx, days);
      let prSum = 0;
      let prCount = 0;

      for (const pt of scada) {
        if (pt.performance_ratio > 0) {
          prSum += pt.performance_ratio;
          prCount++;
        }
      }

      const avgPR = prCount > 0 ? (prSum / prCount) * 100 : 0;
      const model = profile.model;
      if (!modelMap[model]) modelMap[model] = { prSum: 0, count: 0 };
      modelMap[model].prSum += avgPR;
      modelMap[model].count += 1;
    });

    return Object.entries(modelMap).map(([model, data]) => ({
      model,
      actualPR: Math.round((data.prSum / data.count) * 10) / 10,
      datasheetPR: 82,
      gap: Math.round(((data.prSum / data.count) - 82) * 10) / 10,
    }));
  }, [persona, moduleProfiles, days]);

  /* ─── Revenue per module (operator persona) ─── */
  const moduleRevenues = useMemo(() => {
    if (persona !== "operator") return new Map<string, number>();
    const revMap = new Map<string, number>();
    moduleProfiles.forEach((profile, idx) => {
      const fin = getFinancialData(idx, days);
      const totalRev = fin.reduce((s, d) => s + d.revenue_eur, 0);
      const dailyAvg = totalRev / fin.length;
      revMap.set(profile.id, Math.round(dailyAvg * 100) / 100);
    });
    return revMap;
  }, [persona, moduleProfiles, days]);

  // Apply model filter to benchmarks
  const filteredBenchmarks = useMemo(() => {
    if (modelFilter === "all") return benchmarks;
    return benchmarks.filter((b) => b.modelId === modelFilter);
  }, [modelFilter]);

  const sorted = [...filteredBenchmarks].sort((a, b) => {
    const mul = sortAsc ? 1 : -1;
    if (sortKey === "rank") return (a.rank - b.rank) * mul;
    return (a.pr - b.pr) * mul;
  });

  const statusCounts = {
    outperforming: filteredBenchmarks.filter((b) => b.status === "outperforming").length,
    normal: filteredBenchmarks.filter((b) => b.status === "normal").length,
    underperforming: filteredBenchmarks.filter((b) => b.status === "underperforming").length,
  };

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "rank");
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#0D0D0D] uppercase tracking-wider">
          Performance Intelligence
        </h1>
        <p className="text-xs text-[#737373] mt-1">
          Fleet-wide performance ratio analysis with {days}-day forecasting.
        </p>
      </div>

      {/* Fleet PR Hero + Sparkline */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-6 flex items-center gap-8 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#737373]">
            Fleet PR (Current)
          </p>
          <p className="font-mono text-4xl font-bold text-[#0D0D0D] mt-1">
            81.4<span className="text-lg text-[#737373]">%</span>
          </p>
          <p className="text-[10px] text-[#737373] mt-1">
            Target: {forecast.prTarget}%
          </p>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-[10px] uppercase tracking-wider text-[#737373] mb-2">
            30-Day Forecast
          </p>
          <AreaChart
            data={forecast.pr30dForecast}
            height={160}
            color="#22C55E"
            targetValue={forecast.prTarget}
            xLabels={forecast.pr30dForecast.map((_, i) => i === 0 ? "Today" : i === forecast.pr30dForecast.length - 1 ? "Day 30" : "")}
            showDots={true}
          />
        </div>
      </div>

      {/* UPGRADED: Fleet PR Trend (Recharts AreaChart with Brush) */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Fleet PR Trend ({days} days) -- Brushable Zoom
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <RechartsAreaChart data={forecastChartData} margin={{ left: 0, right: 8, top: 8, bottom: 24 }}>
            <defs>
              <linearGradient id="prAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: "#737373", fontFamily: "JetBrains Mono, monospace" }}
              axisLine={{ stroke: "#D9D9D9" }}
              tickLine={false}
            />
            <YAxis
              domain={[70, 90]}
              tick={{ fontSize: 9, fill: "#737373", fontFamily: "JetBrains Mono, monospace" }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value, name) => {
                if (name === "avgPR") return [`${value}%`, "Avg PR"];
                if (name === "totalPower") return [`${value} kWh`, "Total Power"];
                if (name === "avgIrradiance") return [`${value} W/m\u00B2`, "Avg Irradiance"];
                return [String(value), String(name)];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="avgPR"
              stroke="#22C55E"
              strokeWidth={2}
              fill="url(#prAreaGrad)"
              dot={{ r: 2, fill: "#22C55E" }}
            />
            <Brush
              dataKey="date"
              height={20}
              stroke="#D9D9D9"
              fill="#FAFAFA"
              travellerWidth={8}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>

      {/* PR Trend Description */}
      <div className="border border-dashed border-[#D9D9D9] bg-[#F2F2F2] p-4">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-1">
          Seasonal Outlook
        </p>
        <p className="text-xs text-[#0D0D0D] leading-relaxed">
          {forecast.seasonalOutlook}
        </p>
      </div>

      {/* NEW: Daily Energy Yield Stacked Bars */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Daily Energy Yield: Actual vs Expected
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <RechartsBarChart data={energyYieldData} margin={{ left: 0, right: 8, top: 8, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 8, fill: "#737373", fontFamily: "JetBrains Mono, monospace" }}
              axisLine={{ stroke: "#D9D9D9" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#737373", fontFamily: "JetBrains Mono, monospace" }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v) => `${v} kWh`}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value, name) => {
                if (name === "actual") return [`${value} kWh`, "Actual Yield"];
                if (name === "expected") return [`${value} kWh`, "Expected Yield"];
                return [String(value), String(name)];
              }}
              labelFormatter={(label) => {
                const match = energyYieldData.find((d) => d.date === String(label));
                const icon = match?.weather === "sun" ? "\u2600\uFE0F" : match?.weather === "cloud" ? "\u2601\uFE0F" : "\u26C5";
                return `${label} ${icon}`;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="square"
              wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
            />
            <Bar dataKey="expected" fill="#D9D9D9" name="expected" stackId="yield" />
            <Bar dataKey="actual" fill="#22C55E" name="actual" stackId="yield_actual" />
          </RechartsBarChart>
        </ResponsiveContainer>
        {/* Weather legend */}
        <div className="flex items-center gap-4 mt-2 ml-2">
          <span className="text-[9px] text-[#737373] flex items-center gap-1">
            <Sun className="h-3 w-3 text-[#F59E0B]" /> Clear
          </span>
          <span className="text-[9px] text-[#737373] flex items-center gap-1">
            <CloudSun className="h-3 w-3 text-[#737373]" /> Partial
          </span>
          <span className="text-[9px] text-[#737373] flex items-center gap-1">
            <Cloud className="h-3 w-3 text-[#A3A3A3]" /> Cloudy
          </span>
        </div>
      </div>

      {/* PR vs Irradiance Scatter Plot */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-1">
          PR vs Irradiance by Module Personality
        </p>
        <p className="text-[9px] text-[#A3A3A3] mb-3">
          Each dot is a module. Color indicates personality type. Reveals low-light performance drops.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ left: 10, right: 24, top: 16, bottom: 28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
            <XAxis
              type="number"
              dataKey="avgIrradiance"
              name="Avg Irradiance"
              tick={{ fontSize: 9, fill: "#737373", fontFamily: "JetBrains Mono, monospace" }}
              axisLine={{ stroke: "#D9D9D9" }}
              tickLine={false}
              domain={["dataMin - 30", "dataMax + 30"]}
              tickFormatter={(v: number) => `${v} W/m\u00B2`}
              label={{
                value: "Avg Irradiance (W/m\u00B2)",
                position: "insideBottom",
                offset: -12,
                fontSize: 9,
                fill: "#A3A3A3",
              }}
            />
            <YAxis
              type="number"
              dataKey="avgPR"
              name="Avg PR"
              tick={{ fontSize: 9, fill: "#737373", fontFamily: "JetBrains Mono, monospace" }}
              axisLine={false}
              tickLine={false}
              width={50}
              domain={["dataMin - 2", "dataMax + 2"]}
              tickFormatter={(v: number) => `${v}%`}
              label={{
                value: "Avg PR (%)",
                angle: -90,
                position: "insideLeft",
                offset: 4,
                fontSize: 9,
                fill: "#A3A3A3",
              }}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0]?.payload as { moduleId: string; personality: string; avgPR: number; avgIrradiance: number };
                return (
                  <div style={CHART_TOOLTIP_STYLE}>
                    <p className="font-mono text-[10px] font-bold">{data.moduleId}</p>
                    <p className="text-[9px] text-[#737373] capitalize">{data.personality.replace(/_/g, " ")}</p>
                    <p className="text-[9px]">PR: {data.avgPR}%</p>
                    <p className="text-[9px]">Irradiance: {data.avgIrradiance} W/m{"\u00B2"}</p>
                  </div>
                );
              }}
            />
            <Scatter name="Modules" data={filteredScatterData}>
              {filteredScatterData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PERSONALITY_COLORS[entry.personality] ?? "#737373"}
                  r={7}
                  opacity={0.85}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          {[
            { label: "High Performer", color: "#22C55E" },
            { label: "Hotspot", color: "#EF4444" },
            { label: "Batch Defect", color: "#EF4444" },
            { label: "Connector Fault", color: "#F59E0B" },
            { label: "Normal", color: "#737373" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1 text-[9px] text-[#737373]">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* 25-Year Degradation Trajectory */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          25-Year Degradation Trajectory
        </p>
        <DualLineChart
          data={forecast.degradationTrajectory.map((d) => ({
            x: d.year,
            line1: d.actual,
            line2: d.warranty,
          }))}
          line1Color="#22C55E"
          line2Color="#F59E0B"
          line1Label="Actual"
          line2Label="Warranty Min"
          yMin={80}
          yMax={102}
        />
      </div>

      {/* Module Status Distribution */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Module Status Distribution
        </p>
        <BarChart
          bars={[
            { label: "Outperforming", value: statusCounts.outperforming, color: "#22C55E" },
            { label: "Normal", value: statusCounts.normal, color: "#737373" },
            { label: "Underperforming", value: statusCounts.underperforming, color: "#EF4444" },
          ]}
          maxValue={filteredBenchmarks.length}
          showValues={true}
          barHeight={24}
        />
      </div>

      {/* PERSONA (Manufacturer): Model vs Datasheet */}
      {persona === "manufacturer" && modelDatasheetData.length > 0 && (
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-1">
            Model vs Datasheet PR
          </p>
          <p className="text-[9px] text-[#A3A3A3] mb-3">
            Actual average PR per model vs 82% datasheet target. Gap indicates field performance delta.
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <RechartsBarChart data={modelDatasheetData} layout="vertical" margin={{ left: 60, right: 24, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" horizontal={false} />
              <XAxis
                type="number"
                domain={[70, 90]}
                tick={{ fontSize: 9, fill: "#737373", fontFamily: "JetBrains Mono, monospace" }}
                axisLine={{ stroke: "#D9D9D9" }}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="model"
                tick={{ fontSize: 10, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
                width={55}
              />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(value, name) => {
                  if (name === "actualPR") return [`${value}%`, "Actual PR"];
                  if (name === "datasheetPR") return [`${value}%`, "Datasheet"];
                  return [String(value), String(name)];
                }}
              />
              <Bar dataKey="datasheetPR" fill="#D9D9D9" name="datasheetPR" barSize={16} />
              <Bar dataKey="actualPR" fill="#22C55E" name="actualPR" barSize={16} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Full Fleet Benchmarking Table */}
      <div>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Fleet Benchmarking ({filteredBenchmarks.length} modules)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[#D9D9D9] text-xs">
            <thead>
              <tr className="bg-[#F2F2F2]">
                <SortableHeader
                  label="Rank"
                  sortKey="rank"
                  activeSortKey={sortKey}
                  sortAsc={sortAsc}
                  onSort={handleSort}
                />
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Module ID
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Model
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Manufacturer
                </th>
                <SortableHeader
                  label="PR%"
                  sortKey="pr"
                  activeSortKey={sortKey}
                  sortAsc={sortAsc}
                  onSort={handleSort}
                />
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Delta
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Status
                </th>
                {persona === "operator" && (
                  <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                    Revenue/Day
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((m, i) => (
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
                  <td className="px-3 py-2 text-[#0D0D0D]">{m.modelId}</td>
                  <td className="px-3 py-2 text-[#737373]">
                    {m.manufacturer}
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
                    <StatusBadge status={m.status} />
                  </td>
                  {persona === "operator" && (
                    <td className="px-3 py-2 font-mono font-semibold text-[#0D0D0D]">
                      {moduleRevenues.get(m.moduleId) != null
                        ? `EUR ${moduleRevenues.get(m.moduleId)!.toFixed(2)}`
                        : "--"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function SortableHeader({
  label,
  sortKey,
  activeSortKey,
  sortAsc,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeSortKey === sortKey;
  return (
    <th className="text-left px-3 py-2">
      <button
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-[#737373] hover:text-[#0D0D0D] transition-colors"
      >
        {label}
        <ArrowUpDown
          className={`h-2.5 w-2.5 ${isActive ? "text-[#22C55E]" : "text-[#A3A3A3]"}`}
        />
        {isActive && (
          <span className="text-[8px] text-[#A3A3A3]">
            {sortAsc ? "asc" : "desc"}
          </span>
        )}
      </button>
    </th>
  );
}

function StatusBadge({
  status,
}: {
  status: FleetBenchmark["status"];
}) {
  const styles: Record<
    FleetBenchmark["status"],
    { bg: string; text: string }
  > = {
    outperforming: { bg: "#DCFCE7", text: "#166534" },
    normal: { bg: "#F3F4F6", text: "#6B7280" },
    underperforming: { bg: "#FEE2E2", text: "#B91C1C" },
  };
  const s = styles[status];
  return (
    <span
      className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}
