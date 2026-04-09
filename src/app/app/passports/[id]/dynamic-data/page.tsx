"use client";

import { useState } from "react";
import {
  Wifi,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Sparkline } from "@/components/shared/sparkline";
import { PowerChart } from "@/components/app/passports/dynamic/power-chart";
import { DegradationChart } from "@/components/app/passports/dynamic/degradation-chart";
import { PRChart } from "@/components/app/passports/dynamic/pr-chart";
import { EnergyYieldChart } from "@/components/app/passports/dynamic/energy-yield-chart";
import { IrradianceScatter } from "@/components/app/passports/dynamic/irradiance-scatter";
import { TemperatureDeratingChart } from "@/components/app/passports/dynamic/temperature-derating";
import { SoilingChart } from "@/components/app/passports/dynamic/soiling-chart";
import { ClippingChart } from "@/components/app/passports/dynamic/clipping-chart";
import { AvailabilityTimeline } from "@/components/app/passports/dynamic/availability-timeline";
import { RevenueImpact } from "@/components/app/passports/dynamic/revenue-impact";
import { FlashTestComparison } from "@/components/app/passports/dynamic/flash-test-comparison";
import {
  generatePowerData,
  generateDegradationData,
  generatePRData,
  generateEnergyYieldData,
  generateIrradianceCorrelation,
  generateTemperatureDerating,
  generateSoilingData,
  generateClippingData,
  generateAvailabilityData,
  generateAnomalyLog,
  getDynamicKpis,
  getFlashTestData,
  getRevenueLossBreakdown,
} from "@/lib/mock/dynamic-data";

const TIME_RANGES = ["7d", "30d", "90d", "1y", "All"] as const;

const powerData = generatePowerData();
const degradationData = generateDegradationData();
const prData = generatePRData();
const energyYieldData = generateEnergyYieldData();
const irradianceData = generateIrradianceCorrelation();
const temperatureData = generateTemperatureDerating();
const soilingData = generateSoilingData();
const clippingData = generateClippingData();
const availabilityData = generateAvailabilityData();
const anomalyLog = generateAnomalyLog();
const kpis = getDynamicKpis();
const flashTestData = getFlashTestData();
const revenueLossData = getRevenueLossBreakdown();

const SEVERITY_STYLES = {
  low: "bg-[#DBEAFE] text-[#3B82F6]",
  medium: "bg-[#FEF3C7] text-[#F59E0B]",
  high: "bg-[#FEE2E2] text-[#EF4444]",
};

export default function DynamicDataPage() {
  const [timeRange, setTimeRange] = useState<(typeof TIME_RANGES)[number]>("30d");

  return (
    <div className="space-y-6">
      {/* ── Section 1: Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0D0D0D]">Dynamic Data</h2>
          <p className="text-xs text-[#737373]">
            Real-time performance analytics & operational intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex border border-[#D9D9D9]">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 text-[10px] font-semibold tracking-wide transition-colors ${
                  timeRange === range
                    ? "bg-[#22C55E] text-[#0D0D0D]"
                    : "text-[#737373] hover:bg-[#F2F2F2]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 bg-[#22C55E]" />
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-[#22C55E]">
              <Wifi className="h-3 w-3" />
              SCADA · Live
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 2: KPI Snapshot Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="clean-card hover-card group cursor-default p-3"
            style={{ borderTop: `2px dashed ${kpi.accentColor}20` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.6875rem] text-[#737373]">
                {kpi.label}
              </span>
              <Sparkline data={kpi.sparkData} color={kpi.accentColor} />
            </div>
            <div className="mt-1.5">
              <span className="font-mono text-xl font-bold leading-none text-[#0D0D0D]">
                {kpi.value}
              </span>
            </div>
            <p className="mt-1 text-[0.625rem] text-[#A3A3A3]">{kpi.sub}</p>
            <div className="mt-1.5 flex items-center gap-1">
              {kpi.trendUp ? (
                <TrendingUp className="h-2.5 w-2.5 text-[#22C55E]" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 text-[#F59E0B]" />
              )}
              <span
                className={`text-[0.625rem] font-medium ${
                  kpi.trendUp ? "text-[#22C55E]" : "text-[#F59E0B]"
                }`}
              >
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 3: Performance Analysis ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="clean-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0D0D0D]">
                Performance Ratio
              </h3>
              <p className="text-xs text-[#737373]">
                Expected vs actual PR% — gap shows losses
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#737373]">
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 border-t border-dashed border-[#22C55E]" /> Expected
              </span>
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 bg-[#22C55E]" /> Actual
              </span>
            </div>
          </div>
          <div className="mt-2">
            <PRChart data={prData} />
          </div>
        </div>

        <div className="clean-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0D0D0D]">
                Energy Yield
              </h3>
              <p className="text-xs text-[#737373]">
                Monthly kWh expected vs actual + cumulative
              </p>
            </div>
          </div>
          <div className="mt-2">
            <EnergyYieldChart data={energyYieldData} />
          </div>
        </div>
      </div>

      {/* ── Section 4: Power Output ── */}
      <div className="clean-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0D0D0D]">
              Power Output — Last 30 Days
            </h3>
            <p className="text-xs text-[#737373]">
              Daily average active power (W) vs expected
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#A3A3A3]">
            <Clock className="h-3 w-3" />
            Updated 5 min ago
          </div>
        </div>
        <div className="mt-2">
          <PowerChart data={powerData} />
        </div>
      </div>

      {/* ── Section 5: Degradation Analysis ── */}
      <div className="clean-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0D0D0D]">
              Performance Degradation
            </h3>
            <p className="text-xs text-[#737373]">
              30-year projection with confidence band & fleet comparison
            </p>
          </div>
          <div className="border border-[#D9D9D9] px-2 py-1">
            <span className="font-mono text-xs font-semibold text-[#22C55E]">
              0.38%/yr
            </span>
            <span className="ml-1 text-[10px] text-[#737373]">
              vs 0.40% warranted
            </span>
          </div>
        </div>
        <div className="mt-2">
          <DegradationChart data={degradationData} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-[#22C55E]">
            <span className="h-0.5 w-4 bg-[#22C55E]" /> This Module
          </span>
          <span className="flex items-center gap-1 text-[#F59E0B]">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-[#F59E0B]" />
            Warranty Min
          </span>
          <span className="flex items-center gap-1 text-[#A3A3A3]">
            <span className="h-0.5 w-4 border-t border-dashed border-[#A3A3A3]" />
            Fleet Average
          </span>
          <span className="flex items-center gap-1 text-[#22C55E] opacity-40">
            <span className="h-2 w-4 bg-[#22C55E] opacity-20" /> Confidence
          </span>
        </div>
      </div>

      {/* ── Section 6: Correlation Analysis ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="clean-card p-4">
          <h3 className="text-sm font-bold text-[#0D0D0D]">
            Irradiance vs Power
          </h3>
          <p className="text-xs text-[#737373]">
            Points below reference line indicate underperformance
          </p>
          <div className="mt-2">
            <IrradianceScatter data={irradianceData} />
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-[#737373]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-[#86EFAC]" /> Morning
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-[#22C55E]" /> Midday
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-[#F59E0B]" /> Afternoon
            </span>
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-3 border-t border-dashed border-[#A3A3A3]" /> Expected
            </span>
          </div>
        </div>

        <div className="clean-card p-4">
          <h3 className="text-sm font-bold text-[#0D0D0D]">
            Temperature Derating
          </h3>
          <p className="text-xs text-[#737373]">
            Thermal coefficient: -0.34%/°C (STC ref: 25°C)
          </p>
          <div className="mt-2">
            <TemperatureDeratingChart data={temperatureData} />
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-[#737373]">
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-3 bg-[#22C55E]" /> Measured
            </span>
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-3 border-t border-dashed border-[#A3A3A3]" /> Theoretical
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 7: Operational Intelligence ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="clean-card p-4">
          <h3 className="text-sm font-bold text-[#0D0D0D]">
            Soiling Loss
          </h3>
          <p className="mb-3 text-xs text-[#737373]">
            Monthly loss % — hover for revenue impact
          </p>
          <SoilingChart data={soilingData} />
        </div>

        <div className="clean-card p-4">
          <h3 className="text-sm font-bold text-[#0D0D0D]">
            Inverter Clipping
          </h3>
          <p className="mb-3 text-xs text-[#737373]">
            Hours of power limiting per month
          </p>
          <ClippingChart data={clippingData} />
        </div>

        <div className="clean-card p-4">
          <h3 className="text-sm font-bold text-[#0D0D0D]">
            Flash Test vs Field
          </h3>
          <p className="mb-3 text-xs text-[#737373]">
            Factory nameplate vs real-world measurement
          </p>
          <FlashTestComparison data={flashTestData} />
        </div>
      </div>

      {/* ── Section 8: Availability ── */}
      <div className="clean-card p-4">
        <h3 className="text-sm font-bold text-[#0D0D0D]">
          Availability & Downtime
        </h3>
        <p className="mb-3 text-xs text-[#737373]">
          12-month uptime breakdown with reliability metrics
        </p>
        <AvailabilityTimeline data={availabilityData} />
      </div>

      {/* ── Section 9: Revenue Impact ── */}
      <div className="dashed-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-[#EF4444]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">
            Financial Impact
          </h3>
        </div>
        <RevenueImpact data={revenueLossData} />
      </div>

      {/* ── Section 10: Data Quality & Anomaly Log ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Data quality */}
        <div className="clean-card p-4">
          <h3 className="text-sm font-bold text-[#0D0D0D]">Data Quality</h3>
          <div className="mt-3 space-y-2.5">
            {[
              { label: "Freshness", value: "5 min ago", icon: CheckCircle2, ok: true },
              { label: "Completeness", value: "94%", icon: CheckCircle2, ok: true },
              { label: "Source", value: "SCADA v2.1", icon: Wifi, ok: true },
              { label: "Anomalies", value: `${anomalyLog.filter((a) => !a.resolved).length} active`, icon: anomalyLog.some((a) => !a.resolved) ? AlertTriangle : CheckCircle2, ok: !anomalyLog.some((a) => !a.resolved) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-[#737373]">
                  <item.icon className={`h-3.5 w-3.5 ${item.ok ? "text-[#22C55E]" : "text-[#F59E0B]"}`} />
                  {item.label}
                </span>
                <span className="font-mono text-sm font-medium text-[#0D0D0D]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly log */}
        <div className="dashed-card p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#22C55E]" />
            <h3 className="text-sm font-bold text-[#0D0D0D]">
              Anomaly Log
            </h3>
          </div>
          <div className="mt-3 space-y-2">
            {anomalyLog.map((anomaly) => (
              <div
                key={anomaly.id}
                className="flex items-start gap-2 border-b border-[#F2F2F2] pb-2 last:border-0"
              >
                <span
                  className={`mt-0.5 shrink-0 px-1.5 py-0.5 text-[10px] font-semibold ${
                    SEVERITY_STYLES[anomaly.severity]
                  }`}
                >
                  {anomaly.severity.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0D0D0D]">
                      {anomaly.type}
                    </span>
                    {anomaly.resolved && (
                      <CheckCircle2 className="h-3 w-3 text-[#22C55E]" />
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-[#737373]">
                    {anomaly.description}
                  </p>
                  <span className="mt-0.5 font-mono text-[10px] text-[#A3A3A3]">
                    {anomaly.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
