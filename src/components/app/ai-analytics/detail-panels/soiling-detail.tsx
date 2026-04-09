"use client";

import { CountdownRing } from "@/components/app/ai-analytics/shared/countdown-ring";
import {
  getMaintenancePredictions,
  getProvenanceCorrelations,
} from "@/lib/mock/ai-analytics";

const maintenance = getMaintenancePredictions();
const provenance = getProvenanceCorrelations();

export function SoilingDetail() {
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
              EUR {maintenance.maintenanceROI.cleaningCostEur}
            </p>
            <p className="text-[10px] text-[#737373] mt-1">
              Annual savings:{" "}
              <span className="font-mono font-semibold text-[#22C55E]">
                EUR {maintenance.maintenanceROI.annualSavingsEur.toLocaleString("en-US")}
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
                EUR {maintenance.nextCleaning.costIfDelayed}/mo
              </span>
            </p>
          </div>
        </div>
      </section>

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
      </section>
    </div>
  );
}
