"use client";

import { InsightCard } from "@/components/app/ai-analytics/shared/insight-card";
import { AnomalyCard } from "@/components/app/ai-analytics/shared/anomaly-card";
import { DonutChart } from "@/components/app/ai-analytics/shared/donut-chart";
import { BarChart } from "@/components/app/ai-analytics/shared/bar-chart";
import {
  getAIInsights,
  getAnomalyStream,
  getComplianceRiskScoring,
} from "@/lib/mock/ai-analytics";

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

export function ComplianceDetail() {
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

      {/* Full AI Insights Feed */}
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
              <InsightCard insight={insight} />
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

      {/* Full Anomaly Stream */}
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
            </div>
          ))}
        </div>
      </section>

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
