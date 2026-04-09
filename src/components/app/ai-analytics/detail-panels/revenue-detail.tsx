"use client";

import { LossDriverBar } from "@/components/app/ai-analytics/shared/loss-driver-bar";
import {
  getRevenueIntelligence,
  getCarbonOptimization,
} from "@/lib/mock/ai-analytics";

const revenue = getRevenueIntelligence();
const carbon = getCarbonOptimization();

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  easy: { bg: "#DCFCE7", text: "#166534" },
  medium: { bg: "#FEF3C7", text: "#92400E" },
  hard: { bg: "#FEE2E2", text: "#B91C1C" },
};

export function RevenueDetail() {
  const maxCarbon = Math.max(carbon.currentAvgKgCO2e, carbon.industryBenchmark) * 1.15;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#0D0D0D] uppercase tracking-wider">
          Revenue & Carbon Intelligence
        </h1>
        <p className="text-xs text-[#737373] mt-1">
          Financial loss analysis and carbon footprint optimization opportunities.
        </p>
      </div>

      {/* Revenue Intelligence KPIs */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Revenue Intelligence
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">
              Monthly Loss
            </p>
            <p className="font-mono text-2xl font-bold text-[#EF4444] mt-1">
              EUR {revenue.monthlyLoss}
            </p>
            <p className="text-[10px] text-[#737373] mt-0.5">per month</p>
          </div>
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">
              Annual Projected
            </p>
            <p className="font-mono text-2xl font-bold text-[#0D0D0D] mt-1">
              EUR {revenue.annualProjected}
            </p>
            <p className="text-[10px] text-[#737373] mt-0.5">projected annual loss</p>
          </div>
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">
              Optimization Potential
            </p>
            <p className="font-mono text-2xl font-bold text-[#22C55E] mt-1">
              EUR {revenue.optimizationPotential.toLocaleString("en-US")}
            </p>
            <p className="text-[10px] text-[#737373] mt-0.5">
              recoverable per year
            </p>
          </div>
        </div>
      </section>

      {/* Full Loss Driver Breakdown */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Loss Driver Breakdown
        </h2>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5 space-y-4">
          {revenue.lossDrivers.map((driver) => (
            <LossDriverBar key={driver.category} {...driver} />
          ))}
          <div className="border-t border-dashed border-[#D9D9D9] pt-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Total Monthly Loss
            </span>
            <span className="font-mono text-sm font-bold text-[#EF4444]">
              EUR{" "}
              {revenue.lossDrivers
                .reduce((s, d) => s + d.euroPerMonth, 0)
                .toFixed(1)}
              /mo
            </span>
          </div>
        </div>
      </section>

      {/* Carbon Optimization */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Carbon Optimization
        </h2>

        {/* Current vs Benchmark comparison */}
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                Current Average
              </p>
              <p className="font-mono text-2xl font-bold text-[#0D0D0D] mt-1">
                {carbon.currentAvgKgCO2e}{" "}
                <span className="text-xs font-normal text-[#737373]">
                  kg CO2e
                </span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                Industry Benchmark
              </p>
              <p className="font-mono text-2xl font-bold text-[#22C55E] mt-1">
                {carbon.industryBenchmark}{" "}
                <span className="text-xs font-normal text-[#737373]">
                  kg CO2e
                </span>
              </p>
            </div>
          </div>

          {/* Bar comparison */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-20 text-[10px] text-[#737373]">Current</span>
              <div className="flex-1 h-3 bg-[#F2F2F2]">
                <div
                  className="h-full bg-[#F59E0B] transition-all duration-500"
                  style={{
                    width: `${(carbon.currentAvgKgCO2e / maxCarbon) * 100}%`,
                  }}
                />
              </div>
              <span className="w-12 text-right font-mono text-[10px] font-semibold text-[#0D0D0D]">
                {carbon.currentAvgKgCO2e}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-[10px] text-[#737373]">Benchmark</span>
              <div className="flex-1 h-3 bg-[#F2F2F2]">
                <div
                  className="h-full bg-[#22C55E] transition-all duration-500"
                  style={{
                    width: `${(carbon.industryBenchmark / maxCarbon) * 100}%`,
                  }}
                />
              </div>
              <span className="w-12 text-right font-mono text-[10px] font-semibold text-[#737373]">
                {carbon.industryBenchmark}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-[#737373]">
            Potential reduction:{" "}
            <span className="font-mono font-semibold text-[#22C55E]">
              {carbon.potentialReductionPercent}%
            </span>{" "}
            ({Math.round(carbon.currentAvgKgCO2e * carbon.potentialReductionPercent / 100)} kg CO2e)
          </p>
        </div>

        {/* Suggestions Table */}
        <div className="mt-4">
          <h3 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
            Optimization Suggestions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-[#D9D9D9] text-xs">
              <thead>
                <tr className="bg-[#F2F2F2]">
                  {["Action", "Impact (kg CO2e)", "Difficulty"].map((h) => (
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
                {carbon.suggestions.map((row, i) => {
                  const diffStyle =
                    DIFFICULTY_STYLES[row.difficulty] ?? DIFFICULTY_STYLES.medium;
                  return (
                    <tr
                      key={row.action}
                      className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
                    >
                      <td className="px-3 py-2 text-[#0D0D0D] max-w-[400px]">
                        {row.action}
                      </td>
                      <td className="px-3 py-2 font-mono font-semibold text-[#22C55E]">
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
        </div>
      </section>
    </div>
  );
}
