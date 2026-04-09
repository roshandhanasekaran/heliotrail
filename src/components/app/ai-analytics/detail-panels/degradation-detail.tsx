"use client";

import { cn } from "@/lib/utils";
import {
  getProvenanceCorrelations,
  getWarrantyIntelligence,
} from "@/lib/mock/ai-analytics";

const provenance = getProvenanceCorrelations();
const warranty = getWarrantyIntelligence();

const RISK_STYLES: Record<string, { bg: string; text: string }> = {
  normal: { bg: "#DCFCE7", text: "#166534" },
  elevated: { bg: "#FEF3C7", text: "#92400E" },
  critical: { bg: "#FEE2E2", text: "#B91C1C" },
};

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]", border: "border-[#E5E7EB]" },
  medium: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", border: "border-[#FDE68A]" },
  high: { bg: "bg-[#FEE2E2]", text: "text-[#B91C1C]", border: "border-[#FECACA]" },
};

export function DegradationDetail() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#0D0D0D] uppercase tracking-wider">
          Degradation & Warranty Intelligence
        </h1>
        <p className="text-xs text-[#737373] mt-1">
          Provenance-to-performance correlations. The data that makes warranty claims defensible.
        </p>
      </div>

      {/* Section 1: Supplier -> Degradation Correlation */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Section 1: Supplier to Degradation Correlation
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[#D9D9D9] text-xs">
            <thead>
              <tr className="bg-[#F2F2F2]">
                {["Supplier ID", "Material", "Avg Degradation", "Module Count", "vs Fleet Avg", "Risk"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {provenance.supplierDegradation.map((row, i) => {
                const isHighlighted =
                  row.risk === "elevated" || row.risk === "critical";
                const riskStyle = RISK_STYLES[row.risk] ?? RISK_STYLES.normal;
                return (
                  <tr
                    key={row.supplierId}
                    className={cn(
                      isHighlighted
                        ? row.risk === "critical"
                          ? "bg-[#FEF2F2]"
                          : "bg-[#FFFBEB]"
                        : i % 2 === 1
                          ? "bg-[#FAFAFA]"
                          : "bg-white",
                    )}
                  >
                    <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                      {row.supplierId}
                    </td>
                    <td className="px-3 py-2 text-[#0D0D0D]">
                      {row.materialName}
                    </td>
                    <td className="px-3 py-2 font-mono font-semibold text-[#0D0D0D]">
                      {row.avgDegradationRate}%/yr
                    </td>
                    <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                      {row.moduleCount}
                    </td>
                    <td
                      className="px-3 py-2 font-mono font-semibold"
                      style={{
                        color:
                          row.comparedToFleetAvg > 0
                            ? "#EF4444"
                            : row.comparedToFleetAvg < 0
                              ? "#22C55E"
                              : "#737373",
                      }}
                    >
                      {row.comparedToFleetAvg > 0 ? "+" : ""}
                      {row.comparedToFleetAvg.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
                        style={{
                          backgroundColor: riskStyle.bg,
                          color: riskStyle.text,
                        }}
                      >
                        {row.risk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Batch Anomalies */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Section 2: Batch Anomalies
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {provenance.batchAnomalies.map((batch) => {
            const style = SEVERITY_STYLES[batch.severity] ?? SEVERITY_STYLES.low;
            return (
              <div
                key={batch.batchId}
                className={cn(
                  "border border-dashed p-4 space-y-2",
                  style.border,
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0D0D0D]">
                    {batch.batchId}
                  </span>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[8px] font-bold uppercase",
                      style.bg,
                      style.text,
                    )}
                  >
                    {batch.severity}
                  </span>
                </div>
                <p className="text-[10px] text-[#737373]">{batch.company}</p>
                <p className="text-xs font-semibold text-[#0D0D0D]">
                  {batch.modulesAffected} of {batch.modulesTotal} modules
                  affected
                </p>
                <p className="text-[10px] text-[#737373] leading-relaxed">
                  {batch.anomalyType}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Warranty Claim Candidates */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Section 3: Warranty Claim Candidates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[#D9D9D9] text-xs">
            <thead>
              <tr className="bg-[#F2F2F2]">
                {[
                  "Passport ID",
                  "Model",
                  "Degradation Rate",
                  "Warranty Threshold",
                  "Evidence Score",
                  "Est. Value (EUR)",
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
              {warranty.claimReady.map((row, i) => (
                <tr
                  key={row.passportId}
                  className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
                >
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {row.passportId}
                  </td>
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {row.modelId}
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold text-[#EF4444]">
                    {row.degradationRate}%/yr
                  </td>
                  <td className="px-3 py-2 font-mono text-[#737373]">
                    {row.warrantyThreshold}%/yr
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 bg-[#F2F2F2] max-w-[80px]">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${row.evidenceScore}%`,
                            backgroundColor:
                              row.evidenceScore >= 90
                                ? "#22C55E"
                                : row.evidenceScore >= 70
                                  ? "#F59E0B"
                                  : "#EF4444",
                          }}
                        />
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-[#0D0D0D]">
                        {row.evidenceScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono font-bold text-[#0D0D0D]">
                    EUR {row.estimatedClaimValueEur.toLocaleString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          <button
            disabled
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider bg-[#F2F2F2] text-[#A3A3A3] border border-dashed border-[#D9D9D9] cursor-not-allowed"
          >
            Generate Claim Package
          </button>
          <span className="ml-2 text-[9px] text-[#A3A3A3]">
            Coming soon - automated warranty claim documentation
          </span>
        </div>
      </section>

      {/* Section 4: At-Risk Modules */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Section 4: At-Risk Modules
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[#D9D9D9] text-xs">
            <thead>
              <tr className="bg-[#F2F2F2]">
                {[
                  "Passport ID",
                  "Model",
                  "Years to Threshold",
                  "Current Trajectory",
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
              {warranty.atRisk.map((row, i) => (
                <tr
                  key={row.passportId}
                  className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
                >
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {row.passportId}
                  </td>
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {row.modelId}
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold">
                    <span
                      style={{
                        color:
                          row.yearsToThreshold < 3
                            ? "#EF4444"
                            : row.yearsToThreshold < 5
                              ? "#F59E0B"
                              : "#22C55E",
                      }}
                    >
                      {row.yearsToThreshold} yrs
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[#737373]">
                    {row.currentTrajectory}%/yr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Batch Defect Patterns */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Section 5: Batch Defect Patterns
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {warranty.batchDefectPatterns.map((pattern) => (
            <div
              key={pattern.batchId}
              className="border border-dashed border-[#D9D9D9] bg-white p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#0D0D0D]">
                  {pattern.batchId}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#0D0D0D]">
                {pattern.defectType}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#737373]">
                  {pattern.affectedCount} of {pattern.totalInBatch} affected
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#737373]">Confidence:</span>
                  <span
                    className="font-mono text-xs font-bold"
                    style={{
                      color:
                        pattern.confidence >= 85
                          ? "#22C55E"
                          : pattern.confidence >= 70
                            ? "#F59E0B"
                            : "#737373",
                    }}
                  >
                    {pattern.confidence}%
                  </span>
                </div>
              </div>
              {/* Confidence progress bar */}
              <div className="h-1.5 w-full bg-[#F2F2F2]">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${pattern.confidence}%`,
                    backgroundColor:
                      pattern.confidence >= 85
                        ? "#22C55E"
                        : pattern.confidence >= 70
                          ? "#F59E0B"
                          : "#A3A3A3",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
