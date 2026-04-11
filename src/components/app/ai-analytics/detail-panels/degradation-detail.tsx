"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, FileText } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from "recharts";
import { BarChart } from "@/components/app/ai-analytics/shared/bar-chart";
import { DonutChart } from "@/components/app/ai-analytics/shared/donut-chart";
import { DualLineChart } from "@/components/app/ai-analytics/shared/dual-line-chart";
import { ModuleLink } from "@/components/app/ai-analytics/shared/module-link";
import {
  getProvenanceCorrelations,
  getWarrantyIntelligence,
  getPerformanceForecast,
} from "@/lib/mock/ai-analytics";
import {
  getModuleProfiles,
  getScadaData,
  getFinancialData,
  getAnomalyAlerts,
} from "@/lib/mock/ai-analytics-timeseries";
import type { ModuleProfile, AnomalyAlert } from "@/lib/mock/ai-analytics-timeseries";

/* ─── Props ─── */

interface DegradationDetailProps {
  persona?: "manufacturer" | "operator";
  timeRange?: "7d" | "30d" | "90d" | "1y";
  fleetId?: string | null;
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
  background: "var(--card)",
  border: "1px dashed var(--border)",
  borderRadius: 0,
  fontSize: 11,
  fontFamily: "JetBrains Mono, monospace",
  padding: "8px 12px",
};

// Moved inside component as useMemo

const RISK_STYLES: Record<string, { bg: string; text: string }> = {
  normal: { bg: "var(--passport-green-muted)", text: "var(--foreground)" },
  elevated: { bg: "#FEF3C7", text: "#92400E" },
  critical: { bg: "#FEE2E2", text: "#B91C1C" },
};

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: "bg-muted", text: "text-muted-foreground", border: "border-[#E5E7EB]" },
  medium: { bg: "bg-[var(--passport-amber-muted)]", text: "text-[#92400E]", border: "border-[#FDE68A]" },
  high: { bg: "bg-[#FEE2E2]", text: "text-[#B91C1C]", border: "border-[#FECACA]" },
};

const SEVERITY_CIRCLE: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#22C55E",
};

export function DegradationDetail({
  persona = "manufacturer",
  timeRange = "30d",
  fleetId = null,
  modelFilter = "all",
  onModuleClick = () => {},
}: DegradationDetailProps) {
  const provenance = useMemo(() => getProvenanceCorrelations(fleetId), [fleetId]);
  const warranty = useMemo(() => getWarrantyIntelligence(fleetId), [fleetId]);
  const forecast = useMemo(() => getPerformanceForecast(fleetId), [fleetId]);

  const days = TIME_RANGE_DAYS[timeRange] ?? 30;
  const moduleProfiles = useMemo(() => getModuleProfiles(), []);
  const anomalyAlerts = useMemo(() => getAnomalyAlerts(), []);

  /* ─── 25-Year Projection data with Recharts ─── */
  const projectionData = useMemo(() => {
    return forecast.degradationTrajectory.map((d) => ({
      year: d.year,
      actual: d.actual,
      warranty: d.warranty,
    }));
  }, []);

  /* ─── Warranty Claim Builder: modules with high evidence scores ─── */
  const warrantyClaimModules = useMemo(() => {
    // Compute warranty evidence scores per module based on personality
    return moduleProfiles
      .map((profile, idx) => {
        const config = profile;
        // Evidence scoring: based on how much degradation exceeds warranty threshold
        const warrantyThreshold = 0.40; // %/yr
        // Get degradation rate from SCADA data (approximate via personality)
        let degradationRate: number;
        switch (config.personality) {
          case "hotspot":
            degradationRate = 0.62;
            break;
          case "batch_defect":
            degradationRate = 0.55;
            break;
          case "connector_fault":
            degradationRate = 0.45;
            break;
          case "high_performer":
            degradationRate = 0.39;
            break;
          default:
            degradationRate = 0.43;
        }

        const degradationDelta = degradationRate - warrantyThreshold;
        // Evidence score: higher if degradation exceeds threshold more
        const evidenceScore = degradationDelta > 0
          ? Math.min(95, Math.round(60 + degradationDelta * 150))
          : Math.round(30 + ((idx * 17 + 7) % 20));

        // Estimated claim value: degradation_delta * rated_power * 0.5 EUR/Wp
        const claimValue = degradationDelta > 0
          ? Math.round(degradationDelta * config.rated_power_w * 0.5 * 100) / 100
          : 0;

        return {
          moduleId: config.id,
          model: config.model,
          degradationRate,
          warrantyThreshold,
          evidenceScore,
          claimValue,
          degradationDelta,
        };
      })
      .filter((m) => m.evidenceScore > 70)
      .sort((a, b) => b.evidenceScore - a.evidenceScore);
  }, [moduleProfiles]);

  /* ─── Remaining Useful Life (operator persona) ─── */
  const remainingLifeModules = useMemo(() => {
    if (persona !== "operator") return [];

    return moduleProfiles
      .map((profile) => {
        let degradationRate: number;
        switch (profile.personality) {
          case "hotspot":
            degradationRate = 0.62;
            break;
          case "batch_defect":
            degradationRate = 0.55;
            break;
          case "connector_fault":
            degradationRate = 0.45;
            break;
          case "high_performer":
            degradationRate = 0.39;
            break;
          default:
            degradationRate = 0.43;
        }

        const warrantyThreshold = 0.40; // %/yr
        // Current degradation: approximate based on time since install
        const currentDegradation = degradationRate * 0.5; // 0.5 years since install
        const yearsRemaining = degradationRate > warrantyThreshold
          ? Math.round(((warrantyThreshold * 25 - currentDegradation * 25) / (degradationRate - warrantyThreshold)) * 10) / 10
          : 25;

        return {
          moduleId: profile.id,
          model: profile.model,
          personality: profile.personality,
          degradationRate,
          yearsRemaining: Math.max(0, Math.min(yearsRemaining, 25)),
          atRisk: degradationRate > warrantyThreshold,
        };
      })
      .filter((m) => m.atRisk)
      .sort((a, b) => a.yearsRemaining - b.yearsRemaining);
  }, [persona, moduleProfiles]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-foreground uppercase tracking-wider">
          Degradation & Warranty Intelligence
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Provenance-to-performance correlations. The data that makes warranty claims defensible.
        </p>
      </div>

      {/* Section 1: Supplier -> Degradation Correlation */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Section 1: Supplier to Degradation Correlation
        </h2>
        <div className="border border-dashed border-border bg-card p-5 mb-4">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Supplier Degradation Comparison
          </p>
          <BarChart
            bars={provenance.supplierDegradation.map((s) => ({
              label: s.materialName,
              value: s.avgDegradationRate,
              color: s.risk === "elevated" ? "#F59E0B" : s.risk === "critical" ? "#EF4444" : "#22C55E",
            }))}
            maxValue={0.8}
            baselineValue={0.40}
            baselineLabel="Fleet Avg (0.40%/yr)"
            valueSuffix="%/yr"
            barHeight={20}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-border text-xs">
            <thead>
              <tr className="bg-muted">
                {["Supplier ID", "Material", "Avg Degradation", "Module Count", "vs Fleet Avg", "Risk"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground"
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
                          ? "bg-muted/50"
                          : "bg-card",
                    )}
                  >
                    <td className="px-3 py-2 font-mono text-foreground">
                      {row.supplierId}
                    </td>
                    <td className="px-3 py-2 text-foreground">
                      {row.materialName}
                    </td>
                    <td className="px-3 py-2 font-mono font-semibold text-foreground">
                      {row.avgDegradationRate}%/yr
                    </td>
                    <td className="px-3 py-2 font-mono text-foreground">
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
                              : "var(--muted-foreground)",
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
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Section 2: Batch Anomalies
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="border border-dashed border-border bg-card p-5 shrink-0">
            <DonutChart
              segments={[
                { label: "High", value: provenance.batchAnomalies.filter((b) => b.severity === "high").length, color: "#EF4444" },
                { label: "Medium", value: provenance.batchAnomalies.filter((b) => b.severity === "medium").length, color: "#F59E0B" },
                { label: "Low", value: provenance.batchAnomalies.filter((b) => b.severity === "low").length, color: "var(--muted-foreground)" },
              ]}
              size={140}
              strokeWidth={16}
              centerValue={String(provenance.batchAnomalies.length)}
              centerLabel="anomalies"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 flex-1">
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
                    <span className="font-mono text-xs font-bold text-foreground">
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
                  <p className="text-[10px] text-muted-foreground">{batch.company}</p>
                  <p className="text-xs font-semibold text-foreground">
                    {batch.modulesAffected} of {batch.modulesTotal} modules
                    affected
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {batch.anomalyType}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEW: Batch Anomaly Timeline */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Anomaly Detection Timeline
        </h2>
        <div className="border border-dashed border-border bg-card p-5">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4">
              {anomalyAlerts
                .sort((a, b) => new Date(a.detected_at).getTime() - new Date(b.detected_at).getTime())
                .map((alert) => {
                  const date = new Date(alert.detected_at);
                  const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

                  return (
                    <div key={alert.id} className="relative pl-10">
                      {/* Severity dot on timeline */}
                      <div
                        className="absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: SEVERITY_CIRCLE[alert.severity] ?? "var(--muted-foreground)" }}
                      />

                      <div className={cn(
                        "border border-dashed p-3 space-y-1",
                        alert.severity === "high" ? "border-[#FECACA] bg-[#FEF2F2]" :
                        alert.severity === "medium" ? "border-[#FDE68A] bg-[#FFFBEB]" :
                        "border-[#E5E7EB] bg-muted/50",
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle
                              className="h-3 w-3"
                              style={{ color: SEVERITY_CIRCLE[alert.severity] }}
                            />
                            <span className="font-mono text-[10px] font-bold text-foreground">
                              {alert.id}
                            </span>
                            <span
                              className="px-1.5 py-0.5 text-[7px] font-bold uppercase"
                              style={{
                                backgroundColor: alert.severity === "high" ? "#FEE2E2" : alert.severity === "medium" ? "#FEF3C7" : "var(--muted)",
                                color: alert.severity === "high" ? "#B91C1C" : alert.severity === "medium" ? "#92400E" : "var(--muted-foreground)",
                              }}
                            >
                              {alert.severity}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground/70">
                            <Clock className="h-2.5 w-2.5" />
                            {dateStr}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ModuleLink moduleId={alert.module_id} onClick={onModuleClick} />
                          <span className="text-[9px] text-muted-foreground/70">|</span>
                          <span className="text-[9px] text-muted-foreground">
                            Pattern: {alert.pattern}
                          </span>
                          <span className="text-[9px] text-muted-foreground/70">|</span>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            {alert.confidence_pct}% confidence
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Warranty Claim Candidates (existing table) */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Section 3: Warranty Claim Candidates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-border text-xs">
            <thead>
              <tr className="bg-muted">
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
                    className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground"
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
                  className={i % 2 === 1 ? "bg-muted/50" : "bg-card"}
                >
                  <td className="px-3 py-2">
                    <ModuleLink moduleId={row.passportId} onClick={onModuleClick} />
                  </td>
                  <td className="px-3 py-2 font-mono text-foreground">
                    {row.modelId}
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold text-[#EF4444]">
                    {row.degradationRate}%/yr
                  </td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">
                    {row.warrantyThreshold}%/yr
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 bg-muted max-w-[80px]">
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
                      <span className="font-mono text-[10px] font-semibold text-foreground">
                        {row.evidenceScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono font-bold text-foreground">
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
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground/70 border border-dashed border-border cursor-not-allowed"
          >
            Generate Claim Package
          </button>
          <span className="ml-2 text-[9px] text-muted-foreground/70">
            Coming soon - automated warranty claim documentation
          </span>
        </div>
      </section>

      {/* NEW: Warranty Claim Builder */}
      {warrantyClaimModules.length > 0 && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Warranty Claim Builder
          </h2>
          <p className="text-[9px] text-muted-foreground/70 mb-4">
            Modules with warranty evidence score above 70%. Evidence is based on degradation rate exceeding the 0.40%/yr warranty threshold.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {warrantyClaimModules.map((module) => (
              <div
                key={module.moduleId}
                className="border border-dashed border-border bg-card p-4 space-y-3"
              >
                {/* Module ID */}
                <div className="flex items-center justify-between">
                  <ModuleLink moduleId={module.moduleId} onClick={onModuleClick} />
                  <span className="text-[8px] font-mono text-muted-foreground/70">{module.model}</span>
                </div>

                {/* Degradation vs threshold */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Degradation</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#EF4444]">
                      {module.degradationRate.toFixed(2)}%/yr
                    </span>
                    <span className="text-[8px] text-muted-foreground/70">vs</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {module.warrantyThreshold.toFixed(2)}%/yr
                    </span>
                  </div>
                </div>

                {/* Evidence score progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-muted-foreground">Evidence Score</span>
                    <span className="font-mono text-[10px] font-semibold text-foreground">
                      {module.evidenceScore}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${module.evidenceScore}%`,
                        backgroundColor:
                          module.evidenceScore >= 90
                            ? "#22C55E"
                            : module.evidenceScore >= 70
                              ? "#F59E0B"
                              : "#EF4444",
                      }}
                    />
                  </div>
                </div>

                {/* Claim value */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Est. Claim Value</span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    EUR {module.claimValue.toFixed(2)}
                  </span>
                </div>

                {/* Prepare Claim button */}
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground/70 border border-dashed border-border cursor-not-allowed"
                >
                  <FileText className="h-3 w-3" />
                  Prepare Claim
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 4: At-Risk Modules */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Section 4: At-Risk Modules
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-border text-xs">
            <thead>
              <tr className="bg-muted">
                {[
                  "Passport ID",
                  "Model",
                  "Years to Threshold",
                  "Current Trajectory",
                ].map((h) => (
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
              {warranty.atRisk.map((row, i) => (
                <tr
                  key={row.passportId}
                  className={i % 2 === 1 ? "bg-muted/50" : "bg-card"}
                >
                  <td className="px-3 py-2">
                    <ModuleLink moduleId={row.passportId} onClick={onModuleClick} />
                  </td>
                  <td className="px-3 py-2 font-mono text-foreground">
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
                  <td className="px-3 py-2 font-mono text-muted-foreground">
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
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Section 5: Batch Defect Patterns
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {warranty.batchDefectPatterns.map((pattern) => (
            <div
              key={pattern.batchId}
              className="border border-dashed border-border bg-card p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  {pattern.batchId}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground">
                {pattern.defectType}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {pattern.affectedCount} of {pattern.totalInBatch} affected
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Confidence:</span>
                  <span
                    className="font-mono text-xs font-bold"
                    style={{
                      color:
                        pattern.confidence >= 85
                          ? "#22C55E"
                          : pattern.confidence >= 70
                            ? "#F59E0B"
                            : "var(--muted-foreground)",
                    }}
                  >
                    {pattern.confidence}%
                  </span>
                </div>
              </div>
              {/* Confidence progress bar */}
              <div className="h-1.5 w-full bg-muted">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${pattern.confidence}%`,
                    backgroundColor:
                      pattern.confidence >= 85
                        ? "#22C55E"
                        : pattern.confidence >= 70
                          ? "#F59E0B"
                          : "var(--muted-foreground)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: 25-Year Degradation Projection (UPGRADED with Recharts + Brush) */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          Section 6: 25-Year Degradation Projection
        </h2>
        <div className="border border-dashed border-border bg-card p-5">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={projectionData} margin={{ left: 0, right: 16, top: 8, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
                tickFormatter={(v) => `Yr ${v}`}
              />
              <YAxis
                domain={[80, 102]}
                tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}
                axisLine={false}
                tickLine={false}
                width={40}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(value, name) => {
                  if (name === "actual") return [`${value}%`, "Actual Output"];
                  if (name === "warranty") return [`${value}%`, "Warranty Min"];
                  return [String(value), String(name)];
                }}
                labelFormatter={(label) => `Year ${label}`}
              />
              <ReferenceLine y={83.2} stroke="var(--muted-foreground)" strokeDasharray="4 3" strokeWidth={1} />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ r: 3, fill: "#22C55E" }}
                name="actual"
              />
              <Line
                type="monotone"
                dataKey="warranty"
                stroke="#F59E0B"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={{ r: 2, fill: "#F59E0B" }}
                name="warranty"
              />
              <Brush
                dataKey="year"
                height={20}
                stroke="var(--border)"
                fill="var(--accent)"
                travellerWidth={8}
              />
            </LineChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
              <span className="inline-block w-4 h-0.5 bg-primary" /> Actual
            </span>
            <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
              <span className="inline-block w-4 h-0.5 bg-[#F59E0B] border-t border-dashed" /> Warranty Min
            </span>
          </div>
        </div>
      </section>

      {/* PERSONA (Manufacturer): Supplier Degradation Comparison - Enhanced */}
      {persona === "manufacturer" && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Manufacturer Insight: Supplier Degradation Deep Dive
          </h2>
          <div className="border border-dashed border-border bg-card p-5">
            <p className="text-[9px] text-muted-foreground/70 mb-3">
              Detailed supplier degradation comparison with risk-level visibility. Critical and elevated suppliers highlighted.
            </p>
            <BarChart
              bars={provenance.supplierDegradation
                .filter((s) => s.risk === "elevated" || s.risk === "critical")
                .map((s) => ({
                  label: `${s.materialName} (${s.supplierId})`,
                  value: s.avgDegradationRate,
                  color: s.risk === "critical" ? "#EF4444" : "#F59E0B",
                }))}
              maxValue={0.8}
              baselineValue={0.40}
              baselineLabel="Warranty threshold (0.40%/yr)"
              valueSuffix="%/yr"
              barHeight={24}
            />
            <div className="mt-3 flex items-center gap-3">
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span className="inline-block w-2 h-2" style={{ backgroundColor: "#EF4444" }} /> Critical
              </span>
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span className="inline-block w-2 h-2" style={{ backgroundColor: "#F59E0B" }} /> Elevated
              </span>
            </div>
          </div>
        </section>
      )}

      {/* PERSONA (Operator): Remaining Useful Life */}
      {persona === "operator" && remainingLifeModules.length > 0 && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Operator Insight: Remaining Useful Life
          </h2>
          <p className="text-[9px] text-muted-foreground/70 mb-4">
            At-risk modules with estimated years remaining at current degradation rate before warranty threshold breach.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border border-border text-xs">
              <thead>
                <tr className="bg-muted">
                  {["Module ID", "Model", "Type", "Degradation Rate", "Est. Years Remaining"].map((h) => (
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
                {remainingLifeModules.map((m, i) => (
                  <tr
                    key={m.moduleId}
                    className={i % 2 === 1 ? "bg-muted/50" : "bg-card"}
                  >
                    <td className="px-3 py-2">
                      <ModuleLink moduleId={m.moduleId} onClick={onModuleClick} />
                    </td>
                    <td className="px-3 py-2 font-mono text-foreground">{m.model}</td>
                    <td className="px-3 py-2 text-muted-foreground capitalize">
                      {m.personality.replace("_", " ")}
                    </td>
                    <td className="px-3 py-2 font-mono font-semibold text-[#EF4444]">
                      {m.degradationRate.toFixed(2)}%/yr
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono font-bold"
                          style={{
                            color:
                              m.yearsRemaining < 5
                                ? "#EF4444"
                                : m.yearsRemaining < 10
                                  ? "#F59E0B"
                                  : "#22C55E",
                          }}
                        >
                          {m.yearsRemaining.toFixed(1)} yrs
                        </span>
                        {/* Visual indicator bar */}
                        <div className="h-1.5 flex-1 bg-muted max-w-[60px]">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${Math.min((m.yearsRemaining / 25) * 100, 100)}%`,
                              backgroundColor:
                                m.yearsRemaining < 5
                                  ? "#EF4444"
                                  : m.yearsRemaining < 10
                                    ? "#F59E0B"
                                    : "#22C55E",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
