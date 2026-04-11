"use client";

import { useMemo } from "react";
import { LossDriverBar } from "@/components/app/ai-analytics/shared/loss-driver-bar";
import { DonutChart } from "@/components/app/ai-analytics/shared/donut-chart";
import { BarChart } from "@/components/app/ai-analytics/shared/bar-chart";
import {
  getRevenueIntelligence,
  getCarbonOptimization,
} from "@/lib/mock/ai-analytics";
import {
  getFleetFinancialSummary,
  getFleetScadaSummary,
  getModuleProfiles,
  getFinancialData,
} from "@/lib/mock/ai-analytics-timeseries";
import {
  AreaChart as RAreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart as RBarChart,
  ReferenceLine,
  Cell,
} from "recharts";

// Moved inside component as useMemo

function fmtEur(v: number): string {
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1_000) return `€${(v / 1_000).toFixed(1)}k`;
  return `€${v.toFixed(0)}`;
}

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  easy: { bg: "var(--passport-green-muted)", text: "var(--foreground)" },
  medium: { bg: "#FEF3C7", text: "#92400E" },
  hard: { bg: "#FEE2E2", text: "#B91C1C" },
};

interface RevenueDetailProps {
  persona?: "manufacturer" | "operator";
  timeRange?: "7d" | "30d" | "90d" | "1y";
  fleetId?: string | null;
  modelFilter?: string;
  onModuleClick?: (moduleId: string) => void;
}

export function RevenueDetail({
  persona = "manufacturer",
  timeRange = "30d",
  fleetId = null,
  modelFilter = "all",
  onModuleClick = () => {},
}: RevenueDetailProps) {
  const revenue = useMemo(() => getRevenueIntelligence(fleetId), [fleetId]);
  const carbon = useMemo(() => getCarbonOptimization(fleetId), [fleetId]);
  const maxCarbon = Math.max(carbon.currentAvgKgCO2e, carbon.industryBenchmark) * 1.15;

  // Revenue timeline data (stacked areas)
  const revenueTimeline = useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : timeRange === "1y" ? 365 : 30;
    const financial = getFleetFinancialSummary(days);
    return financial.map((fp) => ({
      date: fp.date,
      base_energy: Number((fp.revenue_eur * 0.85).toFixed(2)),
      carbon_credit: Number((fp.carbon_avoided_kg * 0.05).toFixed(2)),
      tariff_premium: Number((fp.revenue_eur * 0.15).toFixed(2)),
    }));
  }, [timeRange]);

  // Spot price overlay data (hourly view from representative day)
  const spotPriceData = useMemo(() => {
    const scadaSummary = getFleetScadaSummary(30);
    const financial = getFleetFinancialSummary(30);

    // Use day 15 as representative; compute hourly from 15-min intervals
    const dayStart = 14 * 96; // day index 14 (0-based), 96 intervals/day
    const dayScada = scadaSummary.slice(dayStart, dayStart + 96);
    const daySpotPrice = financial[14]?.spot_price_eur_mwh ?? 100;

    // Aggregate to hourly
    const hourlyData: { hour: string; energy_kwh: number; spot_price: number }[] = [];
    for (let h = 0; h < 24; h++) {
      const hourSlice = dayScada.slice(h * 4, (h + 1) * 4);
      const totalEnergy = hourSlice.reduce((s, pt) => s + pt.total_power_kw * 0.25, 0);
      // Simulate hourly spot price variation
      const hourFactor = 1 + 0.3 * Math.sin(((h - 12) / 12) * Math.PI);
      hourlyData.push({
        hour: `${h.toString().padStart(2, "0")}:00`,
        energy_kwh: Number(totalEnergy.toFixed(2)),
        spot_price: Number((daySpotPrice * hourFactor).toFixed(1)),
      });
    }
    return hourlyData;
  }, []);

  // Carbon intensity comparison data
  const carbonIntensityData = useMemo(() => {
    const profiles = getModuleProfiles();
    const benchmarks: Record<string, number> = {
      "Mono-PERC HJT": 18,
      TOPCon: 18,
      PERC: 22,
      HJT: 16,
    };

    // Compute per-module carbon intensity using financial data
    return profiles.slice(0, 8).map((mod, idx) => {
      const fin = getFinancialData(idx, 30);
      const totalEnergy = fin.reduce((s, f) => s + f.energy_yield_kwh, 0);
      const totalCarbon = fin.reduce((s, f) => s + f.carbon_avoided_kg, 0);
      // Use embodied carbon estimate: manufacturing carbon / lifetime energy
      // For demo: vary around benchmark
      const benchmark = benchmarks[mod.technology] ?? 20;
      const intensity = Number((benchmark + (idx % 3 - 1) * 2 + idx * 0.3).toFixed(1));
      return {
        module: mod.id.replace("Module-", "M"),
        intensity,
        benchmark,
        technology: mod.technology,
      };
    });
  }, []);

  // Manufacturer: Carbon footprint by model line
  const carbonByModel = useMemo(() => {
    if (persona !== "manufacturer") return [];
    const profiles = getModuleProfiles();
    const modelMap = new Map<string, { totalCarbon: number; count: number }>();

    profiles.forEach((mod, idx) => {
      const fin = getFinancialData(idx, 30);
      const totalCarbon = fin.reduce((s, f) => s + f.carbon_avoided_kg, 0);
      const entry = modelMap.get(mod.model) ?? { totalCarbon: 0, count: 0 };
      entry.totalCarbon += totalCarbon;
      entry.count++;
      modelMap.set(mod.model, entry);
    });

    return Array.from(modelMap.entries()).map(([model, data]) => ({
      model,
      total_co2e_kg: Number(data.totalCarbon.toFixed(1)),
      modules: data.count,
      avg_per_module: Number((data.totalCarbon / data.count).toFixed(1)),
    }));
  }, [persona]);

  // Operator: Revenue by hour optimization
  const hourlyRevenue = useMemo(() => {
    if (persona !== "operator") return [];
    return spotPriceData.map((h) => ({
      ...h,
      revenue: Number((h.energy_kwh * h.spot_price / 1000).toFixed(3)),
      potential: h.spot_price > 110 ? "High" : h.spot_price > 90 ? "Medium" : "Low",
    }));
  }, [persona, spotPriceData]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-foreground uppercase tracking-wider">
          Revenue & Carbon Intelligence
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Financial loss analysis and carbon footprint optimization opportunities.
        </p>
      </div>

      {/* Revenue Intelligence KPIs */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Revenue Intelligence
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border border-dashed border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Monthly Loss
            </p>
            <p className="font-mono text-2xl font-bold text-[#EF4444] mt-1">
              {fmtEur(revenue.monthlyLoss)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">per month</p>
          </div>
          <div className="border border-dashed border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Annual Projected
            </p>
            <p className="font-mono text-2xl font-bold text-foreground mt-1">
              {fmtEur(revenue.annualProjected)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">projected annual loss</p>
          </div>
          <div className="border border-dashed border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Optimization Potential
            </p>
            <p className="font-mono text-2xl font-bold text-primary mt-1">
              {fmtEur(revenue.optimizationPotential)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              recoverable per year
            </p>
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground/70 mt-3">
          * Financial estimates assume €0.15/kWh average tariff. Actual values depend on operator&apos;s PPA and grid conditions.
        </p>
      </section>

      {/* Full Loss Driver Breakdown */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Loss Driver Breakdown
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="border border-dashed border-border bg-card p-5 shrink-0">
            <DonutChart
              segments={revenue.lossDrivers.map((d) => ({
                label: d.category,
                value: d.percent,
                color: d.color,
              }))}
              size={160}
              strokeWidth={20}
              centerValue={fmtEur(revenue.monthlyLoss)}
              centerLabel="per month"
            />
          </div>
          <div className="border border-dashed border-border bg-card p-5 space-y-4">
            {revenue.lossDrivers.map((driver) => (
              <LossDriverBar key={driver.category} {...driver} />
            ))}
            <div className="border-t border-dashed border-border pt-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Monthly Loss
              </span>
              <span className="font-mono text-sm font-bold text-[#EF4444]">
                {fmtEur(revenue.lossDrivers.reduce((s, d) => s + d.euroPerMonth, 0))}/mo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Revenue Timeline (Stacked Areas) */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Revenue Breakdown Timeline ({timeRange})
        </h2>
        <div className="border border-dashed border-border bg-card p-5">
          <p className="text-[10px] text-muted-foreground mb-3">
            Stacked revenue components: energy sales, carbon credits, and feed-in tariff premiums.
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <RAreaChart data={revenueTimeline} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <defs>
                <linearGradient id="revEnergyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="revCarbonFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="revTariffFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}
                tickFormatter={(v: string) => v.slice(5)}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}
                tickFormatter={(v: number) => `€${v.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--foreground)",
                  border: "none",
                  borderRadius: 0,
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "var(--muted)",
                }}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    base_energy: "Energy Revenue",
                    carbon_credit: "Carbon Credits",
                    tariff_premium: "Tariff Premium",
                  };
                  return [`€${Number(value).toFixed(2)}`, labels[String(name)] ?? name];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="base_energy"
                stackId="1"
                stroke="#22C55E"
                strokeWidth={1.5}
                fill="url(#revEnergyFill)"
                name="base_energy"
              />
              <Area
                type="monotone"
                dataKey="carbon_credit"
                stackId="1"
                stroke="#3B82F6"
                strokeWidth={1.5}
                fill="url(#revCarbonFill)"
                name="carbon_credit"
              />
              <Area
                type="monotone"
                dataKey="tariff_premium"
                stackId="1"
                stroke="#F59E0B"
                strokeWidth={1.5}
                fill="url(#revTariffFill)"
                name="tariff_premium"
              />
            </RAreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 bg-primary" />
              <span className="text-[9px] text-muted-foreground">Energy Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 bg-[#3B82F6]" />
              <span className="text-[9px] text-muted-foreground">Carbon Credits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 bg-[#F59E0B]" />
              <span className="text-[9px] text-muted-foreground">Tariff Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Spot Price Overlay */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Generation vs. Spot Price (Representative Day)
        </h2>
        <div className="border border-dashed border-border bg-card p-5">
          <p className="text-[10px] text-muted-foreground mb-3">
            Hourly energy generation (bars) overlaid with spot price (line). Reveals whether generation aligns with high-price hours.
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={spotPriceData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}
                interval={2}
              />
              <YAxis
                yAxisId="energy"
                tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}
                tickFormatter={(v: number) => `${v.toFixed(1)}`}
                label={{
                  value: "kWh",
                  position: "insideTopLeft",
                  offset: -5,
                  style: { fontSize: 8, fill: "var(--muted-foreground)" },
                }}
              />
              <YAxis
                yAxisId="price"
                orientation="right"
                tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}
                tickFormatter={(v: number) => `€${v.toFixed(0)}`}
                label={{
                  value: "EUR/MWh",
                  position: "insideTopRight",
                  offset: -5,
                  style: { fontSize: 8, fill: "var(--muted-foreground)" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--foreground)",
                  border: "none",
                  borderRadius: 0,
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "var(--muted)",
                }}
                formatter={(value, name) => {
                  if (name === "energy_kwh") return [`${Number(value).toFixed(2)} kWh`, "Energy Generated"];
                  return [`€${Number(value).toFixed(1)}/MWh`, "Spot Price"];
                }}
              />
              <Bar
                yAxisId="energy"
                dataKey="energy_kwh"
                fill="#22C55E"
                fillOpacity={0.6}
                name="energy_kwh"
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="spot_price"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                name="spot_price"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 bg-primary opacity-60" />
              <span className="text-[9px] text-muted-foreground">Energy Generated (kWh)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-4 bg-[#F59E0B]" />
              <span className="text-[9px] text-muted-foreground">Spot Price (EUR/MWh)</span>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Carbon Intensity Comparison */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Carbon Intensity Comparison (gCO2e/kWh)
        </h2>
        <div className="border border-dashed border-border bg-card p-5">
          <p className="text-[10px] text-muted-foreground mb-3">
            Per-module embodied carbon intensity vs. industry benchmarks by technology.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <RBarChart
              data={carbonIntensityData}
              layout="vertical"
              margin={{ top: 10, right: 40, bottom: 10, left: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}
                tickFormatter={(v: number) => `${v}`}
                domain={[0, 30]}
              />
              <YAxis
                dataKey="module"
                type="category"
                tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--foreground)",
                  border: "none",
                  borderRadius: 0,
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "var(--muted)",
                }}
                formatter={(value, name) => {
                  if (name === "intensity") return [`${value} gCO2e/kWh`, "Module Intensity"];
                  return [`${value} gCO2e/kWh`, "Benchmark"];
                }}
              />
              <Bar dataKey="intensity" name="intensity" fill="#3B82F6" fillOpacity={0.7} barSize={14}>
                {carbonIntensityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.intensity > entry.benchmark ? "#F59E0B" : "#22C55E"}
                    fillOpacity={0.7}
                  />
                ))}
              </Bar>
              {/* Benchmark reference lines */}
              <ReferenceLine x={18} stroke="#3B82F6" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "TOPCon 18", position: "top", fill: "#3B82F6", fontSize: 8 }} />
              <ReferenceLine x={22} stroke="#EF4444" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "PERC 22", position: "top", fill: "#EF4444", fontSize: 8 }} />
              <ReferenceLine x={16} stroke="#22C55E" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "HJT 16", position: "top", fill: "#22C55E", fontSize: 8 }} />
            </RBarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* PERSONA: Manufacturer - Carbon Footprint by Model Line */}
      {persona === "manufacturer" && carbonByModel.length > 0 && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Carbon Footprint by Model Line
          </h2>
          <div className="border border-dashed border-border bg-card p-5">
            <div className="overflow-x-auto">
              <table className="w-full border border-border text-xs">
                <thead>
                  <tr className="bg-muted">
                    {["Model", "Modules", "Total CO2e Avoided (kg)", "Avg per Module (kg)"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {carbonByModel.map((row, i) => (
                    <tr
                      key={row.model}
                      className={i % 2 === 1 ? "bg-muted/50" : "bg-card"}
                    >
                      <td className="px-3 py-2 font-mono font-semibold text-foreground">
                        {row.model}
                      </td>
                      <td className="px-3 py-2 font-mono text-foreground">
                        {row.modules}
                      </td>
                      <td className="px-3 py-2 font-mono font-semibold text-primary">
                        {row.total_co2e_kg.toLocaleString("en-US")}
                      </td>
                      <td className="px-3 py-2 font-mono text-foreground">
                        {row.avg_per_module.toLocaleString("en-US")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* PERSONA: Operator - Revenue Optimization */}
      {persona === "operator" && hourlyRevenue.length > 0 && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Revenue Optimization by Hour
          </h2>
          <div className="border border-dashed border-border bg-card p-5">
            <p className="text-[10px] text-muted-foreground mb-3">
              Highest revenue potential hours for scheduling maintenance outside peak generation.
            </p>
            <div className="grid gap-3 sm:grid-cols-3 mb-4">
              {(() => {
                const sorted = [...hourlyRevenue].sort((a, b) => b.revenue - a.revenue);
                const top3 = sorted.slice(0, 3);
                return top3.map((h) => (
                  <div
                    key={h.hour}
                    className="border border-dashed border-border bg-muted/50 p-3"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Peak: {h.hour}
                    </p>
                    <p className="font-mono text-lg font-bold text-primary mt-1">
                      EUR {h.revenue.toFixed(3)}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      Spot: EUR {h.spot_price}/MWh
                    </p>
                  </div>
                ));
              })()}
            </div>
            <p className="text-[10px] text-muted-foreground">
              <span className="font-semibold text-[#F59E0B]">Recommendation:</span> Schedule
              maintenance before 07:00 or after 19:00 to minimize revenue impact. Avoid 10:00-15:00
              for maximum generation capture.
            </p>
          </div>
        </section>
      )}

      {/* Carbon Optimization */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Carbon Optimization
        </h2>

        {/* Current vs Benchmark comparison */}
        <div className="border border-dashed border-border bg-card p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Current Average
              </p>
              <p className="font-mono text-2xl font-bold text-foreground mt-1">
                {carbon.currentAvgKgCO2e}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  kg CO2e
                </span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Industry Benchmark
              </p>
              <p className="font-mono text-2xl font-bold text-primary mt-1">
                {carbon.industryBenchmark}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  kg CO2e
                </span>
              </p>
            </div>
          </div>

          {/* Bar comparison */}
          <BarChart
            bars={[
              { label: "Current", value: carbon.currentAvgKgCO2e, color: "#F59E0B" },
              { label: "Benchmark", value: carbon.industryBenchmark, color: "#22C55E" },
              {
                label: "After Optimization",
                value: Math.round(carbon.currentAvgKgCO2e * (1 - carbon.potentialReductionPercent / 100)),
                color: "#86EFAC",
              },
            ]}
            showValues={true}
            valueSuffix=" kg"
            barHeight={24}
          />

          <p className="text-[10px] text-muted-foreground">
            Potential reduction:{" "}
            <span className="font-mono font-semibold text-primary">
              {carbon.potentialReductionPercent}%
            </span>{" "}
            ({Math.round(carbon.currentAvgKgCO2e * carbon.potentialReductionPercent / 100)} kg CO2e)
          </p>
        </div>

        {/* Suggestions Table */}
        <div className="mt-4">
          <h3 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Optimization Suggestions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-border text-xs">
              <thead>
                <tr className="bg-muted">
                  {["Action", "Impact (kg CO2e)", "Difficulty"].map((h) => (
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
                {carbon.suggestions.map((row, i) => {
                  const diffStyle =
                    DIFFICULTY_STYLES[row.difficulty] ?? DIFFICULTY_STYLES.medium;
                  return (
                    <tr
                      key={row.action}
                      className={i % 2 === 1 ? "bg-muted/50" : "bg-card"}
                    >
                      <td className="px-3 py-2 text-foreground max-w-[400px]">
                        {row.action}
                      </td>
                      <td className="px-3 py-2 font-mono font-semibold text-primary">
                        -{row.impactKgCO2e}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
                          style={{
                            backgroundColor: diffStyle.bg,
                            color: diffStyle.text,
                          }}
                        >
                          {row.difficulty}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 border border-dashed border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
              Impact Comparison
            </p>
            <BarChart
              bars={[...carbon.suggestions]
                .sort((a, b) => b.impactKgCO2e - a.impactKgCO2e)
                .map((s) => ({
                  label: s.action.slice(0, 30) + (s.action.length > 30 ? "..." : ""),
                  value: s.impactKgCO2e,
                  color: s.difficulty === "easy" ? "#22C55E" : s.difficulty === "medium" ? "#F59E0B" : "#EF4444",
                }))}
              showValues={true}
              valueSuffix=" kg"
              barHeight={22}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
