"use client";

import { FleetHealthGauge } from "@/components/app/ai-analytics/shared/fleet-health-gauge";
import { AnomalyCard } from "@/components/app/ai-analytics/shared/anomaly-card";
import {
  getFleetHealthScore,
  getAnomalyStream,
  getFleetBenchmarking,
  getWarrantyIntelligence,
  getCarbonOptimization,
} from "@/lib/mock/ai-analytics";

const healthScore = getFleetHealthScore();
const anomalies = getAnomalyStream();
const benchmarks = getFleetBenchmarking();
const warranty = getWarrantyIntelligence();
const carbon = getCarbonOptimization();

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

export function SummaryDetail() {
  const topAlerts = anomalies.filter((a) => !a.resolved).slice(0, 3);
  const topBenchmarks = benchmarks.slice(0, 5);

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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.label}
            className="border border-dashed border-[#D9D9D9] bg-[#F2F2F2] p-4"
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
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {m.moduleId}
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
