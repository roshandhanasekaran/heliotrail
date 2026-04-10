"use client";

import { useState, useMemo } from "react";
import { InsightCard } from "@/components/app/ai-analytics/shared/insight-card";
import { AnomalyCard } from "@/components/app/ai-analytics/shared/anomaly-card";
import { ModuleLink } from "@/components/app/ai-analytics/shared/module-link";
import { DonutChart } from "@/components/app/ai-analytics/shared/donut-chart";
import { BarChart } from "@/components/app/ai-analytics/shared/bar-chart";
import {
  getAIInsights,
  getAnomalyStream,
  getComplianceRiskScoring,
} from "@/lib/mock/ai-analytics";
import {
  getModuleProfiles,
  getFleetFinancialSummary,
} from "@/lib/mock/ai-analytics-timeseries";
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const insights = getAIInsights();
const anomalies = getAnomalyStream();
const complianceRisks = getComplianceRiskScoring();

const RISK_LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  low: { bg: "#DCFCE7", text: "#166534" },
  medium: { bg: "#FEF3C7", text: "#92400E" },
  high: { bg: "#FEE2E2", text: "#B91C1C" },
};

function riskScoreColor(score: number): string {
  if (score >= 70) return "#EF4444";
  if (score >= 30) return "#F59E0B";
  return "#22C55E";
}

// ESPR Compliance Requirements
const MANDATORY_REQUIREMENTS = [
  { id: "dppid", label: "Digital product passport unique ID", status: "complete" as const },
  { id: "cf", label: "Carbon footprint declaration", status: "complete" as const },
  { id: "mc", label: "Material composition disclosure", status: "complete" as const },
  { id: "svhc", label: "Substances of concern (SVHC)", status: "complete" as const },
  { id: "rc", label: "Recycled content percentage", status: "complete" as const },
  { id: "dur", label: "Durability information", status: "partial" as const },
];

const VOLUNTARY_REQUIREMENTS: { id: string; label: string; status: "complete" | "partial" | "incomplete" }[] = [
  { id: "rep", label: "Repairability score", status: "partial" },
  { id: "scd", label: "Supply chain due diligence", status: "incomplete" },
];

interface ComplianceDetailProps {
  persona?: "manufacturer" | "operator";
  timeRange?: "7d" | "30d" | "90d" | "1y";
  modelFilter?: string;
  onModuleClick?: (moduleId: string) => void;
}

export function ComplianceDetail({
  persona = "manufacturer",
  timeRange = "30d",
  modelFilter = "all",
  onModuleClick = () => {},
}: ComplianceDetailProps) {
  // Expandable insight cards
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  const toggleInsight = (id: string) => {
    setExpandedInsights((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Risk Score Trend data (30-day random walk per module)
  const riskTrendData = useMemo(() => {
    // Take top 5 riskiest modules
    const topRisks = [...complianceRisks]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

    const days = timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : timeRange === "1y" ? 365 : 30;
    const data: Record<string, number | string>[] = [];

    // Seeded random for deterministic data
    let seed = 42;
    const seededRandom = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let d = 0; d < days; d++) {
      const dateStr = new Date(
        Date.UTC(2026, 2, 12) + d * 86400000
      ).toISOString().split("T")[0]!;
      const point: Record<string, number | string> = { date: dateStr };

      topRisks.forEach((risk) => {
        const baseScore = risk.riskScore;
        // Random walk: drift towards base with noise
        const dayVariation = (seededRandom() - 0.5) * 8;
        const trendDrift = (d / days) * (seededRandom() > 0.5 ? 5 : -3);
        const score = Math.max(
          0,
          Math.min(100, baseScore + dayVariation + trendDrift)
        );
        point[risk.passportId] = Number(score.toFixed(1));
      });

      data.push(point);
    }

    return { data, modules: topRisks };
  }, [timeRange]);

  // ESPR compliance stats
  const completionStats = useMemo(() => {
    const allReqs = [...MANDATORY_REQUIREMENTS, ...VOLUNTARY_REQUIREMENTS];
    const complete = allReqs.filter((r) => r.status === "complete").length;
    const partial = allReqs.filter((r) => r.status === "partial").length;
    const incomplete = allReqs.filter((r) => r.status === "incomplete").length;
    const total = allReqs.length;
    const pct = Math.round(((complete + partial * 0.5) / total) * 100);
    const mandatoryComplete = MANDATORY_REQUIREMENTS.filter((r) => r.status === "complete").length;
    const mandatoryTotal = MANDATORY_REQUIREMENTS.length;
    const voluntaryComplete = VOLUNTARY_REQUIREMENTS.filter((r) => r.status === "complete").length;
    const voluntaryPartial = VOLUNTARY_REQUIREMENTS.filter((r) => r.status === "partial").length;
    const voluntaryTotal = VOLUNTARY_REQUIREMENTS.length;
    return {
      complete, partial, incomplete, total, pct,
      mandatoryComplete, mandatoryTotal,
      voluntaryComplete, voluntaryPartial, voluntaryTotal,
    };
  }, []);

  // Supply chain risk data for manufacturer persona
  const supplyChainRisk = [
    { country: "China", riskLevel: "Medium", modules: 6 },
    { country: "Germany", riskLevel: "Low", modules: 4 },
    { country: "South Korea", riskLevel: "Low", modules: 3 },
    { country: "Malaysia", riskLevel: "Low", modules: 2 },
  ];

  // ESG metrics for operator persona
  const esgMetrics = useMemo(() => {
    if (persona !== "operator") return null;
    const financial = getFleetFinancialSummary(30);
    const totalCarbonAvoided = financial.reduce((s, f) => s + f.carbon_avoided_kg, 0);
    const gridEmissionFactor = 0.42; // kg CO2e/kWh
    const totalEnergy = financial.reduce((s, f) => s + f.energy_yield_kwh, 0);
    const scope2Savings = totalEnergy * gridEmissionFactor;
    return {
      totalCarbonAvoided: Number(totalCarbonAvoided.toFixed(1)),
      gridEmissionFactor,
      scope2Savings: Number(scope2Savings.toFixed(1)),
      totalEnergy: Number(totalEnergy.toFixed(1)),
    };
  }, [persona]);

  // Risk trend line colors
  const RISK_COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#22C55E", "#737373"];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#0D0D0D] uppercase tracking-wider">
          Compliance & Risk
        </h1>
        <p className="text-xs text-[#737373] mt-1">
          AI-generated insights, anomaly detection feed, and compliance risk scoring.
        </p>
      </div>

      {/* Full AI Insights Feed — UPGRADED: Expandable */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          AI Insights Feed ({insights.length})
        </h2>
        <div className="space-y-2">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="border border-dashed border-[#D9D9D9] bg-white"
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleInsight(insight.id)}
              >
                <div className="flex-1">
                  <InsightCard insight={insight} />
                </div>
                <button
                  type="button"
                  className="p-2.5 text-[#737373] hover:text-[#0D0D0D] transition-colors shrink-0"
                  aria-label={expandedInsights.has(insight.id) ? "Collapse" : "Expand"}
                >
                  {expandedInsights.has(insight.id) ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              {expandedInsights.has(insight.id) && (
                <div className="px-2.5 pb-2.5 border-t border-dashed border-[#D9D9D9] pt-2">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-1">
                    Evidence Details
                  </p>
                  <p className="text-[10px] text-[#737373] leading-relaxed">
                    Confidence: {insight.confidence}% | Category: {insight.category} |
                    Severity: {insight.severity}
                  </p>
                  <p className="text-[10px] text-[#737373] leading-relaxed mt-1">
                    {insight.detail}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Anomaly Severity Summary */}
      <div className="flex items-center gap-4 mb-2">
        {["high", "medium", "low"].map((sev) => {
          const count = anomalies.filter((a) => a.severity === sev).length;
          const colors: Record<string, { bg: string; text: string }> = {
            high: { bg: "#FEE2E2", text: "#B91C1C" },
            medium: { bg: "#FEF3C7", text: "#92400E" },
            low: { bg: "#F3F4F6", text: "#6B7280" },
          };
          const style = colors[sev]!;
          return (
            <div
              key={sev}
              className="flex items-center gap-1.5 px-2.5 py-1.5"
              style={{ backgroundColor: style.bg }}
            >
              <span
                className="font-mono text-sm font-bold"
                style={{ color: style.text }}
              >
                {count}
              </span>
              <span
                className="text-[9px] font-bold uppercase"
                style={{ color: style.text }}
              >
                {sev}
              </span>
            </div>
          );
        })}
      </div>

      {/* Full Anomaly Stream — UPGRADED: ModuleLink for clickable module IDs */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Anomaly Stream ({anomalies.length})
        </h2>
        <div className="space-y-2">
          {anomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className="border border-dashed border-[#D9D9D9] bg-white"
            >
              <AnomalyCard anomaly={anomaly} />
              {anomaly.module && (
                <div className="px-2.5 pb-2 -mt-1">
                  <span className="text-[9px] text-[#737373] mr-1">Module:</span>
                  <ModuleLink
                    moduleId={anomaly.module}
                    onClick={onModuleClick}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Risk Score Trend Chart */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Risk Score Trend ({timeRange})
        </h2>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
          <p className="text-[10px] text-[#737373] mb-3">
            Risk score evolution for the top 5 highest-risk passports over the selected period.
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={riskTrendData.data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "#A3A3A3", fontFamily: "JetBrains Mono, monospace" }}
                tickFormatter={(v: string) => v.slice(5)}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: "#A3A3A3", fontFamily: "JetBrains Mono, monospace" }}
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
                labelFormatter={(label) => `Date: ${label}`}
              />
              {riskTrendData.modules.map((risk, idx) => (
                <Line
                  key={risk.passportId}
                  type="monotone"
                  dataKey={risk.passportId}
                  stroke={RISK_COLORS[idx % RISK_COLORS.length]}
                  strokeWidth={1.5}
                  dot={false}
                  name={risk.passportId.replace("DPP-", "")}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {riskTrendData.modules.map((risk, idx) => (
              <div key={risk.passportId} className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2"
                  style={{ backgroundColor: RISK_COLORS[idx % RISK_COLORS.length] }}
                />
                <span className="text-[9px] font-mono text-[#737373]">
                  {risk.passportId.replace("DPP-", "")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: ESPR Compliance Checklist */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          EU ESPR Compliance Checklist
        </h2>
        <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[#737373]">
                Overall Compliance
              </span>
              <span className="font-mono text-sm font-bold text-[#0D0D0D]">
                {completionStats.pct}%
              </span>
            </div>
            <div className="h-3 w-full bg-[#F2F2F2] flex">
              <div
                className="h-full bg-[#22C55E] transition-all duration-500"
                style={{
                  width: `${(completionStats.complete / completionStats.total) * 100}%`,
                }}
              />
              <div
                className="h-full bg-[#F59E0B] transition-all duration-500"
                style={{
                  width: `${(completionStats.partial / completionStats.total) * 100}%`,
                }}
              />
              <div
                className="h-full bg-[#EF4444] transition-all duration-500"
                style={{
                  width: `${(completionStats.incomplete / completionStats.total) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[9px] text-[#737373]">
                <span className="font-mono font-semibold text-[#22C55E]">{completionStats.mandatoryComplete}/{completionStats.mandatoryTotal}</span> mandatory
              </span>
              <span className="text-[9px] text-[#737373]">
                <span className="font-mono font-semibold text-[#F59E0B]">{completionStats.voluntaryComplete + completionStats.voluntaryPartial}/{completionStats.voluntaryTotal}</span> voluntary
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#737373]">Mandatory</p>
            {MANDATORY_REQUIREMENTS.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-2 py-1.5 border-b border-[#F2F2F2] last:border-0"
              >
                {req.status === "complete" ? (
                  <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                ) : req.status === "partial" ? (
                  <AlertTriangle className="h-4 w-4 text-[#F59E0B] shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                )}
                <span className="text-xs text-[#0D0D0D] flex-1">{req.label}</span>
                <span
                  className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
                  style={{
                    backgroundColor:
                      req.status === "complete"
                        ? "#DCFCE7"
                        : req.status === "partial"
                          ? "#FEF3C7"
                          : "#FEE2E2",
                    color:
                      req.status === "complete"
                        ? "#166534"
                        : req.status === "partial"
                          ? "#92400E"
                          : "#B91C1C",
                  }}
                >
                  {req.status}
                </span>
              </div>
            ))}
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#737373] mt-4">Voluntary</p>
            {VOLUNTARY_REQUIREMENTS.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-2 py-1.5 border-b border-[#F2F2F2] last:border-0"
              >
                {req.status === "complete" ? (
                  <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                ) : req.status === "partial" ? (
                  <AlertTriangle className="h-4 w-4 text-[#F59E0B] shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                )}
                <span className="text-xs text-[#0D0D0D] flex-1">{req.label}</span>
                <span
                  className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
                  style={{
                    backgroundColor:
                      req.status === "complete"
                        ? "#DCFCE7"
                        : req.status === "partial"
                          ? "#FEF3C7"
                          : "#FEE2E2",
                    color:
                      req.status === "complete"
                        ? "#166534"
                        : req.status === "partial"
                          ? "#92400E"
                          : "#B91C1C",
                  }}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONA: Manufacturer - Supply Chain Risk */}
      {persona === "manufacturer" && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
            Supply Chain Risk Assessment
          </h2>
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
            <div className="overflow-x-auto">
              <table className="w-full border border-[#D9D9D9] text-xs">
                <thead>
                  <tr className="bg-[#F2F2F2]">
                    {["Country", "Risk Level", "# Modules"].map((h) => (
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
                  {supplyChainRisk.map((row, i) => {
                    const riskStyle =
                      row.riskLevel === "Low"
                        ? { bg: "#DCFCE7", text: "#166534" }
                        : row.riskLevel === "Medium"
                          ? { bg: "#FEF3C7", text: "#92400E" }
                          : { bg: "#FEE2E2", text: "#B91C1C" };
                    return (
                      <tr
                        key={row.country}
                        className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
                      >
                        <td className="px-3 py-2 font-semibold text-[#0D0D0D]">
                          {row.country}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
                            style={{
                              backgroundColor: riskStyle.bg,
                              color: riskStyle.text,
                            }}
                          >
                            {row.riskLevel}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                          {row.modules}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* PERSONA: Operator - ESG Reporting Readiness */}
      {persona === "operator" && esgMetrics && (
        <section>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
            ESG Reporting Readiness
          </h2>
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
            <p className="text-[10px] text-[#737373] mb-4">
              Carbon metrics formatted for ESG report disclosure (30-day period).
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-4">
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                  Total CO2 Avoided
                </p>
                <p className="font-mono text-xl font-bold text-[#22C55E] mt-1">
                  {esgMetrics.totalCarbonAvoided.toLocaleString("en-US")} kg
                </p>
                <p className="text-[9px] text-[#737373] mt-0.5">
                  = {(esgMetrics.totalCarbonAvoided / 1000).toFixed(2)} tonnes CO2e
                </p>
              </div>
              <div className="border border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-4">
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                  Grid Emission Factor
                </p>
                <p className="font-mono text-xl font-bold text-[#0D0D0D] mt-1">
                  {esgMetrics.gridEmissionFactor} kg/kWh
                </p>
                <p className="text-[9px] text-[#737373] mt-0.5">
                  EU average (2025 reference)
                </p>
              </div>
              <div className="border border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-4">
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                  Scope 2 Savings
                </p>
                <p className="font-mono text-xl font-bold text-[#22C55E] mt-1">
                  {esgMetrics.scope2Savings.toLocaleString("en-US")} kg
                </p>
                <p className="text-[9px] text-[#737373] mt-0.5">
                  from {esgMetrics.totalEnergy.toLocaleString("en-US")} kWh clean energy
                </p>
              </div>
              <div className="border border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-4">
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                  Carbon Credit Potential
                </p>
                <p className="font-mono text-xl font-bold text-[#3B82F6] mt-1">
                  EUR {(esgMetrics.totalCarbonAvoided * 0.05).toFixed(2)}
                </p>
                <p className="text-[9px] text-[#737373] mt-0.5">
                  at EUR 0.05/kg CO2e (voluntary market)
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Risk Level Distribution */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Risk Level Distribution
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="border border-dashed border-[#D9D9D9] bg-white p-5 shrink-0">
            <DonutChart
              segments={[
                {
                  label: "High",
                  value: complianceRisks.filter((r) => r.riskLevel === "high").length,
                  color: "#EF4444",
                },
                {
                  label: "Medium",
                  value: complianceRisks.filter((r) => r.riskLevel === "medium").length,
                  color: "#F59E0B",
                },
                {
                  label: "Low",
                  value: complianceRisks.filter((r) => r.riskLevel === "low").length,
                  color: "#22C55E",
                },
              ]}
              size={150}
              strokeWidth={18}
              centerValue={String(complianceRisks.length)}
              centerLabel="passports"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
              Risk Score by Passport
            </p>
            <BarChart
              bars={[...complianceRisks]
                .sort((a, b) => b.riskScore - a.riskScore)
                .map((r) => ({
                  label: r.passportId.replace("DPP-", ""),
                  value: r.riskScore,
                  color:
                    r.riskLevel === "high"
                      ? "#EF4444"
                      : r.riskLevel === "medium"
                        ? "#F59E0B"
                        : "#22C55E",
                }))}
              maxValue={100}
              baselineValue={30}
              baselineLabel="Medium threshold"
              showValues={true}
              barHeight={18}
            />
          </div>
        </div>
      </section>

      {/* Compliance Risk Table */}
      <section>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Compliance Risk Scoring ({complianceRisks.length} passports)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[#D9D9D9] text-xs">
            <thead>
              <tr className="bg-[#F2F2F2]">
                {[
                  "Passport ID",
                  "Model",
                  "Risk Score",
                  "Risk Level",
                  "Factors",
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
              {complianceRisks.map((row, i) => {
                const levelStyle =
                  RISK_LEVEL_STYLES[row.riskLevel] ?? RISK_LEVEL_STYLES.low;
                return (
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
                    <td className="px-3 py-2">
                      <span
                        className="font-mono text-sm font-bold"
                        style={{ color: riskScoreColor(row.riskScore) }}
                      >
                        {row.riskScore}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
                        style={{
                          backgroundColor: levelStyle.bg,
                          color: levelStyle.text,
                        }}
                      >
                        {row.riskLevel}
                      </span>
                    </td>
                    <td className="px-3 py-2 max-w-[350px]">
                      <ul className="space-y-0.5">
                        {row.factors.map((factor, fi) => (
                          <li
                            key={fi}
                            className="text-[10px] text-[#737373] leading-snug"
                          >
                            <span className="text-[#A3A3A3] mr-1">-</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
