"use client";

import { FleetHealthGauge } from "@/components/app/ai-analytics/shared/fleet-health-gauge";
import { AreaChart } from "@/components/app/ai-analytics/shared/area-chart";
import {
  getFleetHealthScore,
  getFleetHealthHistory,
  getFleetBenchmarking,
} from "@/lib/mock/ai-analytics";

const healthScore = getFleetHealthScore();
const healthHistory = getFleetHealthHistory();
const benchmarks = getFleetBenchmarking();

export function FleetHealthDetail() {
  const topModules = benchmarks.slice(0, 3);
  const bottomModules = benchmarks.slice(-3).reverse();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#0D0D0D] uppercase tracking-wider">
          Fleet Health
        </h1>
        <p className="text-xs text-[#737373] mt-1">
          Composite health score with trend analysis and fleet ranking breakdown.
        </p>
      </div>

      {/* Hero: Gauge + Score */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-6">
        <div className="flex items-center gap-8 flex-wrap">
          <div className="scale-[1.4] origin-center ml-4">
            <FleetHealthGauge
              score={healthScore.overall}
              delta={healthScore.weeklyDelta}
              breakdown={healthScore.breakdown}
            />
          </div>
          <div className="flex-1 min-w-[200px] ml-6">
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">
              Overall Fleet Health
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="font-mono text-5xl font-bold text-[#0D0D0D]">
                {healthScore.overall}
              </span>
              <span className="text-sm text-[#737373]">/ 100</span>
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
              <span className="text-[10px] text-[#A3A3A3]">
                vs last week
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Bars */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Score Breakdown
        </h2>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5 space-y-3">
          {healthScore.breakdown.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="w-32 text-[11px] text-[#737373] truncate">
                {b.label}
              </span>
              <div className="flex-1 h-2.5 bg-[#F2F2F2] relative">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${b.score}%`,
                    backgroundColor: b.color,
                  }}
                />
              </div>
              <span className="w-8 text-right font-mono text-xs font-bold text-[#0D0D0D]">
                {b.score}
              </span>
              <span
                className="w-16 text-center px-1.5 py-0.5 text-[8px] font-bold uppercase"
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
              <span className="w-10 text-right font-mono text-[9px] text-[#A3A3A3]">
                {(b.weight * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Health Trend */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          8-Week Health Trend
        </h2>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
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
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Fleet Ranking Snapshot
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Top performers */}
          <div>
            <p className="text-[9px] uppercase tracking-wider font-semibold text-[#22C55E] mb-2">
              Top Performers
            </p>
            <div className="space-y-2">
              {topModules.map((m) => (
                <div
                  key={m.moduleId}
                  className="border border-dashed border-[#D9D9D9] bg-white p-3 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#0D0D0D]">
                      #{m.rank}
                    </span>
                    <span className="ml-2 font-mono text-xs text-[#0D0D0D]">
                      {m.moduleId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0D0D0D]">
                      {m.pr}%
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-[#22C55E]">
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
                  className="border border-dashed border-[#D9D9D9] bg-white p-3 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#0D0D0D]">
                      #{m.rank}
                    </span>
                    <span className="ml-2 font-mono text-xs text-[#0D0D0D]">
                      {m.moduleId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0D0D0D]">
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

      {/* Weight Methodology */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Score Methodology
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[#D9D9D9] text-xs">
            <thead>
              <tr className="bg-[#F2F2F2]">
                {["Category", "Weight", "Score", "Weighted"].map((h) => (
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
              {healthScore.breakdown.map((b, i) => (
                <tr
                  key={b.label}
                  className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
                >
                  <td className="px-3 py-2 text-[#0D0D0D]">{b.label}</td>
                  <td className="px-3 py-2 font-mono text-[#737373]">
                    {(b.weight * 100).toFixed(0)}%
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold text-[#0D0D0D]">
                    {b.score}
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold" style={{ color: b.color }}>
                    {(b.score * b.weight).toFixed(1)}
                  </td>
                </tr>
              ))}
              <tr className="bg-[#F2F2F2] font-bold">
                <td className="px-3 py-2 text-[#0D0D0D]">Total</td>
                <td className="px-3 py-2 font-mono text-[#737373]">100%</td>
                <td className="px-3 py-2" />
                <td className="px-3 py-2 font-mono text-[#22C55E]">
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
