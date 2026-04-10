"use client";

import { useState, useMemo } from "react";
import { BarChart } from "@/components/app/ai-analytics/shared/bar-chart";
import { AreaChart } from "@/components/app/ai-analytics/shared/area-chart";
import { CountdownRing } from "@/components/app/ai-analytics/shared/countdown-ring";
import {
  getMaintenancePredictions,
  getProvenanceCorrelations,
} from "@/lib/mock/ai-analytics";
import {
  getWeatherData,
  getMaintenanceEvents,
  getScadaData,
} from "@/lib/mock/ai-analytics-timeseries";
import {
  LineChart,
  Line,
  AreaChart as RAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const maintenance = getMaintenancePredictions();
const provenance = getProvenanceCorrelations();

function fmtEur(v: number): string {
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1_000) return `€${(v / 1_000).toFixed(1)}k`;
  return `€${v.toFixed(0)}`;
}

interface SoilingDetailProps {
  persona?: "manufacturer" | "operator";
  timeRange?: "7d" | "30d" | "90d" | "1y";
  modelFilter?: string;
  onModuleClick?: (moduleId: string) => void;
}

export function SoilingDetail({
  persona = "manufacturer",
  timeRange = "30d",
  modelFilter = "all",
  onModuleClick = () => {},
}: SoilingDetailProps) {
  // Soiling accumulation chart data
  const soilingData = useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : timeRange === "1y" ? 365 : 30;
    const weather = getWeatherData(days);
    const maintenanceEvts = getMaintenanceEvents();

    // Group hourly data by day and average dust_index
    const dailyDust: { date: string; soiling_pct: number }[] = [];
    const hoursPerDay = 24;
    const totalDays = Math.floor(weather.length / hoursPerDay);

    for (let d = 0; d < totalDays; d++) {
      const daySlice = weather.slice(d * hoursPerDay, (d + 1) * hoursPerDay);
      const avgDust = daySlice.reduce((s, w) => s + w.dust_index, 0) / daySlice.length;
      const dateStr = daySlice[0]?.timestamp
        ? new Date(daySlice[0].timestamp).toISOString().split("T")[0]!
        : `Day ${d + 1}`;
      dailyDust.push({
        date: dateStr,
        soiling_pct: Number((avgDust * 0.8).toFixed(2)),
      });
    }

    // Get cleaning event dates
    const cleaningDates = maintenanceEvts
      .filter((e) => e.type === "cleaning")
      .map((e) => e.date);

    return { dailyDust, cleaningDates };
  }, [timeRange]);

  // Temperature derating chart data
  const deratingData = useMemo(() => {
    // Get average day data from SCADA for module 0
    const scada = getScadaData(0, 30);
    const hourlyBuckets: { temp_sum: number; ambient_sum: number; count: number }[] = Array.from(
      { length: 24 },
      () => ({ temp_sum: 0, ambient_sum: 0, count: 0 })
    );

    for (const pt of scada) {
      const hour = new Date(pt.timestamp).getHours();
      hourlyBuckets[hour]!.temp_sum += pt.module_temp_c;
      hourlyBuckets[hour]!.ambient_sum += pt.ambient_temp_c;
      hourlyBuckets[hour]!.count++;
    }

    // Build chart data for hours 6-20 (daylight)
    const chartData: {
      hour: string;
      efficiency: number;
      ambient_scaled: number;
      module_temp: number;
    }[] = [];

    for (let h = 6; h <= 20; h++) {
      const bucket = hourlyBuckets[h]!;
      if (bucket.count === 0) continue;
      const avgTemp = bucket.temp_sum / bucket.count;
      const avgAmbient = bucket.ambient_sum / bucket.count;
      const efficiency = Number((1 - Math.max(0, (avgTemp - 25) * 0.004)).toFixed(4));
      chartData.push({
        hour: `${h}:00`,
        efficiency: Number(efficiency.toFixed(3)),
        ambient_scaled: Number(((avgAmbient / 40) * 0.15 + 0.85).toFixed(3)), // scale ambient to efficiency range
        module_temp: Number(avgTemp.toFixed(1)),
      });
    }

    return chartData;
  }, []);

  // Cleaning delay cost projection for operator persona
  const cleaningProjection = useMemo(() => {
    const baseCost = maintenance.nextCleaning.costIfDelayed;
    return [
      { days: 0, cost: 0 },
      { days: 5, cost: Number((baseCost * 0.17).toFixed(1)) },
      { days: 10, cost: Number((baseCost * 0.33).toFixed(1)) },
      { days: 15, cost: Number((baseCost * 0.5).toFixed(1)) },
      { days: 20, cost: Number((baseCost * 0.67).toFixed(1)) },
      { days: 25, cost: Number((baseCost * 0.83).toFixed(1)) },
      { days: 30, cost: baseCost },
    ];
  }, []);

  // Material durability for manufacturer persona
  const durabilityData = [
    { component: "Tempered Glass", score: 95, status: "Excellent" },
    { component: "Backsheet (PPE)", score: 88, status: "Good" },
    { component: "Junction Box (IP68)", score: 92, status: "Excellent" },
    { component: "MC4 Connector", score: 78, status: "Fair" },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#0D0D0D] uppercase tracking-wider">
          Soiling & Environmental
        </h1>
        <p className="text-xs text-[#737373] mt-1">
          Cleaning schedules, component risk, and material-driven environmental factors.
        </p>
      </div>

      {/* Cleaning Schedule Summary */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Cleaning Schedule
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Next Cleaning */}
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5 flex items-center gap-4">
            <CountdownRing days={maintenance.nextCleaning.daysUntil} max={30} />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                Next Cleaning
              </p>
              <p className="font-mono text-xl font-bold text-[#0D0D0D]">
                {maintenance.nextCleaning.daysUntil} days
              </p>
              <p className="text-[10px] text-[#737373]">
                Est. soiling at cleaning:{" "}
                <span className="font-mono font-semibold text-[#F59E0B]">
                  {maintenance.nextCleaning.estimatedSoilingAtCleaning}%
                </span>
              </p>
            </div>
          </div>

          {/* Cleaning Cost */}
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">
              Cleaning Cost
            </p>
            <p className="font-mono text-xl font-bold text-[#0D0D0D] mt-1">
              {fmtEur(maintenance.maintenanceROI.cleaningCostEur)}
            </p>
            <p className="text-[10px] text-[#737373] mt-1">
              Annual savings:{" "}
              <span className="font-mono font-semibold text-[#22C55E]">
                {fmtEur(maintenance.maintenanceROI.annualSavingsEur)}
              </span>
            </p>
          </div>

          {/* Cleaning ROI */}
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">
              ROI Payback
            </p>
            <p className="font-mono text-xl font-bold text-[#22C55E] mt-1">
              {maintenance.maintenanceROI.paybackDays} days
            </p>
            <p className="text-[10px] text-[#737373] mt-1">
              Cost if delayed:{" "}
              <span className="font-mono font-semibold text-[#EF4444]">
                {fmtEur(maintenance.nextCleaning.costIfDelayed)}/mo
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Cleaning ROI Comparison */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Cleaning ROI Comparison
        </h2>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
          <BarChart
            bars={[
              { label: "Cleaning Cost", value: maintenance.maintenanceROI.cleaningCostEur, color: "#737373" },
              { label: "Annual Savings", value: maintenance.maintenanceROI.annualSavingsEur, color: "#22C55E" },
              { label: "Cost if Delayed", value: maintenance.nextCleaning.costIfDelayed * 12, color: "#EF4444" },
            ]}
            showValues={true}
            valueSuffix=" EUR"
            barHeight={24}
          />
        </div>
      </section>

      {/* NEW: Soiling Accumulation Chart */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Soiling Accumulation ({timeRange})
        </h2>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
          <p className="text-[10px] text-[#737373] mb-3">
            Dust-driven soiling loss over time. Vertical lines mark cleaning events where soiling resets.
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <RAreaChart data={soilingData.dailyDust} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <defs>
                <linearGradient id="soilingFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "#A3A3A3", fontFamily: "JetBrains Mono, monospace" }}
                tickFormatter={(v: string) => v.slice(5)}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#A3A3A3", fontFamily: "JetBrains Mono, monospace" }}
                tickFormatter={(v: number) => `${v}%`}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D0D0D",
                  border: "none",
                  borderRadius: 0,
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#F2F2F2",
                }}
                formatter={(value) => [`${value}%`, "Soiling Loss"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              {soilingData.cleaningDates.map((date) => (
                <ReferenceLine
                  key={date}
                  x={date}
                  stroke="#22C55E"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{
                    value: "Clean",
                    position: "top",
                    fill: "#22C55E",
                    fontSize: 8,
                  }}
                />
              ))}
              <Area
                type="monotone"
                dataKey="soiling_pct"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#soilingFill)"
                name="Soiling Loss %"
              />
            </RAreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* NEW: Temperature Derating Chart */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Temperature Derating (Typical Day)
        </h2>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
          <p className="text-[10px] text-[#737373] mb-3">
            Module temperature effect on efficiency. Morning cool = high efficiency, afternoon hot = derating.
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={deratingData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 9, fill: "#A3A3A3", fontFamily: "JetBrains Mono, monospace" }}
              />
              <YAxis
                domain={[0.85, 1.0]}
                tick={{ fontSize: 9, fill: "#A3A3A3", fontFamily: "JetBrains Mono, monospace" }}
                tickFormatter={(v: number) => v.toFixed(2)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D0D0D",
                  border: "none",
                  borderRadius: 0,
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#F2F2F2",
                }}
                formatter={(value, name) => [
                  name === "efficiency"
                    ? `${(Number(value) * 100).toFixed(1)}%`
                    : `${Number(value).toFixed(3)}`,
                  name === "efficiency" ? "Efficiency Factor" : "Ambient (scaled)",
                ]}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 3, fill: "#EF4444" }}
                name="efficiency"
              />
              <Line
                type="monotone"
                dataKey="ambient_scaled"
                stroke="#3B82F6"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
                name="ambient_scaled"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-4 bg-[#EF4444]" />
              <span className="text-[9px] text-[#737373]">Efficiency Factor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-4 bg-[#3B82F6]" style={{ borderTop: "1.5px dashed #3B82F6", height: 0 }} />
              <span className="text-[9px] text-[#737373]">Ambient Temp (scaled)</span>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONA: Operator - Cleaning ROI Optimizer */}
      {persona === "operator" && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
            Cleaning ROI Optimizer
          </h2>
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
            <p className="text-[10px] text-[#737373] mb-3">
              Soiling cost projection if cleaning is delayed. Each day of delay increases energy loss costs.
            </p>
            <div className="grid gap-3 sm:grid-cols-3 mb-4">
              {[
                { delay: 7, label: "7-day delay" },
                { delay: 14, label: "14-day delay" },
                { delay: 30, label: "30-day delay" },
              ].map(({ delay, label }) => {
                const cost = Number(
                  (maintenance.nextCleaning.costIfDelayed * (delay / 30)).toFixed(1)
                );
                return (
                  <div
                    key={delay}
                    className="border border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-3"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                      {label}
                    </p>
                    <p className="font-mono text-lg font-bold text-[#EF4444] mt-1">
                      {fmtEur(cost)}
                    </p>
                    <p className="text-[9px] text-[#737373]">additional cost</p>
                  </div>
                );
              })}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <RAreaChart data={cleaningProjection} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
                <XAxis
                  dataKey="days"
                  tick={{ fontSize: 9, fill: "#A3A3A3", fontFamily: "JetBrains Mono, monospace" }}
                  tickFormatter={(v: number) => `${v}d`}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#A3A3A3", fontFamily: "JetBrains Mono, monospace" }}
                  tickFormatter={(v: number) => fmtEur(v)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D0D0D",
                    border: "none",
                    borderRadius: 0,
                    fontSize: 11,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#F2F2F2",
                  }}
                  formatter={(value) => [fmtEur(Number(value)), "Cost if Delayed"]}
                  labelFormatter={(label) => `Delay: ${label} days`}
                />
                <defs>
                  <linearGradient id="delayCostFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#delayCostFill)"
                />
              </RAreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* PERSONA: Manufacturer - Material Durability */}
      {persona === "manufacturer" && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
            Material Durability Assessment
          </h2>
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
            <div className="overflow-x-auto">
              <table className="w-full border border-[#D9D9D9] text-xs">
                <thead>
                  <tr className="bg-[#F2F2F2]">
                    {["Component", "Durability Score", "Status"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {durabilityData.map((row, i) => (
                    <tr
                      key={row.component}
                      className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
                    >
                      <td className="px-3 py-2 text-[#0D0D0D] font-semibold">
                        {row.component}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 bg-[#F2F2F2]">
                            <div
                              className="h-full transition-all duration-500"
                              style={{
                                width: `${row.score}%`,
                                backgroundColor:
                                  row.score >= 90
                                    ? "#22C55E"
                                    : row.score >= 80
                                      ? "#F59E0B"
                                      : "#EF4444",
                              }}
                            />
                          </div>
                          <span
                            className="font-mono text-sm font-bold"
                            style={{
                              color:
                                row.score >= 90
                                  ? "#22C55E"
                                  : row.score >= 80
                                    ? "#F59E0B"
                                    : "#EF4444",
                            }}
                          >
                            {row.score}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
                          style={{
                            backgroundColor:
                              row.status === "Excellent"
                                ? "#DCFCE7"
                                : row.status === "Good"
                                  ? "#FEF3C7"
                                  : "#FEE2E2",
                            color:
                              row.status === "Excellent"
                                ? "#166534"
                                : row.status === "Good"
                                  ? "#92400E"
                                  : "#B91C1C",
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Component Risk Assessment */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Component Risk Assessment
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5 space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                Modules at Risk
              </p>
              <p className="font-mono text-2xl font-bold text-[#F59E0B] mt-1">
                {maintenance.componentRisk.modulesAtRisk}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                Highest Risk Module
              </p>
              <p className="font-mono text-sm font-bold text-[#0D0D0D] mt-0.5">
                {maintenance.componentRisk.highestRisk}
              </p>
            </div>
          </div>

          <div className="border border-dashed border-[#D9D9D9] bg-white p-5 space-y-3">
            {/* 30-day failure probability */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                  Failure Probability (30d)
                </p>
                <span
                  className="font-mono text-sm font-bold"
                  style={{
                    color:
                      maintenance.componentRisk.failureProbability30d > 5
                        ? "#EF4444"
                        : "#F59E0B",
                  }}
                >
                  {maintenance.componentRisk.failureProbability30d}%
                </span>
              </div>
              <div className="h-2 w-full bg-[#F2F2F2] mt-1">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${maintenance.componentRisk.failureProbability30d}%`,
                    backgroundColor:
                      maintenance.componentRisk.failureProbability30d > 5
                        ? "#EF4444"
                        : "#F59E0B",
                  }}
                />
              </div>
            </div>

            {/* 90-day failure probability */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                  Failure Probability (90d)
                </p>
                <span
                  className="font-mono text-sm font-bold"
                  style={{
                    color:
                      maintenance.componentRisk.failureProbability90d > 10
                        ? "#EF4444"
                        : "#F59E0B",
                  }}
                >
                  {maintenance.componentRisk.failureProbability90d}%
                </span>
              </div>
              <div className="h-2 w-full bg-[#F2F2F2] mt-1">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${maintenance.componentRisk.failureProbability90d}%`,
                    backgroundColor:
                      maintenance.componentRisk.failureProbability90d > 10
                        ? "#EF4444"
                        : "#F59E0B",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5 mt-4">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
            Failure Probability Curve (90 Days)
          </p>
          <AreaChart
            data={[
              0,
              1.2,
              2.5,
              maintenance.componentRisk.failureProbability30d,
              6.5,
              8.2,
              maintenance.componentRisk.failureProbability90d,
            ]}
            height={160}
            color="#EF4444"
            xLabels={["Day 0", "", "Day 15", "Day 30", "", "Day 60", "Day 90"]}
            yMin={0}
            yMax={15}
            showDots={true}
          />
        </div>
      </section>

      {/* Material Risk Factors */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Material Risk Factors
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[#D9D9D9] text-xs">
            <thead>
              <tr className="bg-[#F2F2F2]">
                {[
                  "Material",
                  "Origin",
                  "Risk Type",
                  "Incidence Rate",
                  "Affected Modules",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {provenance.materialRiskFactors.map((row, i) => (
                <tr
                  key={`${row.material}-${row.riskType}`}
                  className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
                >
                  <td className="px-3 py-2 text-[#0D0D0D] font-semibold">
                    {row.material}
                  </td>
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {row.originCountry}
                  </td>
                  <td className="px-3 py-2 text-[#737373]">{row.riskType}</td>
                  <td className="px-3 py-2">
                    <span
                      className="font-mono font-semibold"
                      style={{
                        color:
                          row.incidenceRate > 1.5
                            ? "#EF4444"
                            : row.incidenceRate > 0
                              ? "#F59E0B"
                              : "#22C55E",
                      }}
                    >
                      {row.incidenceRate}%
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {row.affectedModules}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5 mt-4">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
            Risk Incidence by Material
          </p>
          <BarChart
            bars={provenance.materialRiskFactors.map((r) => ({
              label: r.material,
              value: r.incidenceRate,
              color: r.incidenceRate > 1.5 ? "#EF4444" : r.incidenceRate > 0 ? "#F59E0B" : "#22C55E",
            }))}
            showValues={true}
            valueSuffix="%"
            barHeight={20}
          />
        </div>
      </section>
    </div>
  );
}
