"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Activity,
  TrendingDown,
  TrendingUp,
  Droplets,
  DollarSign,
  ShieldAlert,
  Heart,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

import { FleetHealthGauge } from "@/components/app/ai-analytics/shared/fleet-health-gauge";
import { CountdownRing } from "@/components/app/ai-analytics/shared/countdown-ring";
import { LossDriverBar } from "@/components/app/ai-analytics/shared/loss-driver-bar";
import { Sparkline } from "@/components/shared/sparkline";

import {
  getFleetHealthScore,
  getFleetBenchmarking,
  getPerformanceForecast,
  getWarrantyIntelligence,
  getProvenanceCorrelations,
  getMaintenancePredictions,
  getRevenueIntelligence,
  getCarbonOptimization,
  getAnomalyStream,
  getAIInsights,
  getComplianceRiskScoring,
} from "@/lib/mock/ai-analytics";

/* ─── Types ─── */

interface AIAnalyticsSidebarProps {
  activeSection: string | null;
  onSelectSection: (section: string) => void;
}

/* ─── Section definitions ─── */

const SECTIONS = [
  { id: "fleet-health", label: "Fleet Health", icon: Heart },
  { id: "performance", label: "Performance Intelligence", icon: Activity },
  { id: "degradation", label: "Degradation & Warranty", icon: TrendingDown },
  { id: "soiling", label: "Soiling & Environmental", icon: Droplets },
  { id: "revenue", label: "Revenue & Carbon", icon: DollarSign },
  { id: "compliance", label: "Compliance & Risk", icon: ShieldAlert },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/* ─── Load mock data at module level (static) ─── */

const healthScore = getFleetHealthScore();
const benchmarks = getFleetBenchmarking();
const forecast = getPerformanceForecast();
const warranty = getWarrantyIntelligence();
const provenance = getProvenanceCorrelations();
const maintenance = getMaintenancePredictions();
const revenue = getRevenueIntelligence();
const carbon = getCarbonOptimization();
const anomalies = getAnomalyStream();
const insights = getAIInsights();
const complianceRisks = getComplianceRiskScoring();

/* ─── Main component ─── */

export function AIAnalyticsSidebar({
  activeSection,
  onSelectSection,
}: AIAnalyticsSidebarProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["fleet-health"]),
  );

  function toggleSection(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="w-80 shrink-0 border-r border-[#D9D9D9] bg-white overflow-y-auto h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#D9D9D9]">
        <h2 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
          AI Analytics
        </h2>
      </div>

      {/* Accordion sections */}
      {SECTIONS.map((section) => {
        const isExpanded = expanded.has(section.id);
        const isActive = activeSection === section.id;

        return (
          <div key={section.id} className="border-b border-[#E5E5E5]">
            {/* Section header */}
            <button
              onClick={() => {
                toggleSection(section.id);
                onSelectSection(section.id);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors",
                isActive
                  ? "bg-[#F0FDF4] border-l-2 border-l-[#22C55E]"
                  : "hover:bg-[#FAFAFA]",
              )}
            >
              <section.icon
                className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  isActive ? "text-[#22C55E]" : "text-[#737373]",
                )}
              />
              <span
                className={cn(
                  "flex-1 text-[11px] font-bold uppercase tracking-[0.08em]",
                  isActive ? "text-[#0D0D0D]" : "text-[#737373]",
                )}
              >
                {section.label}
              </span>
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 shrink-0 text-[#A3A3A3]" />
              ) : (
                <ChevronRight className="h-3 w-3 shrink-0 text-[#A3A3A3]" />
              )}
            </button>

            {/* Section content */}
            {isExpanded && (
              <div className="px-4 pb-3">
                <SectionContent
                  sectionId={section.id}
                  onSelectSection={onSelectSection}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Section content router ─── */

function SectionContent({
  sectionId,
  onSelectSection,
}: {
  sectionId: SectionId;
  onSelectSection: (section: string) => void;
}) {
  switch (sectionId) {
    case "fleet-health":
      return <FleetHealthContent onSelectSection={onSelectSection} />;
    case "performance":
      return <PerformanceContent onSelectSection={onSelectSection} />;
    case "degradation":
      return <DegradationContent onSelectSection={onSelectSection} />;
    case "soiling":
      return <SoilingContent onSelectSection={onSelectSection} />;
    case "revenue":
      return <RevenueContent onSelectSection={onSelectSection} />;
    case "compliance":
      return <ComplianceContent onSelectSection={onSelectSection} />;
  }
}

/* ─── A. Fleet Health ─── */

function FleetHealthContent({
  onSelectSection,
}: {
  onSelectSection: (section: string) => void;
}) {
  return (
    <div className="dashed-card p-3">
      <div className="flex justify-center">
        <FleetHealthGauge
          score={healthScore.overall}
          delta={healthScore.weeklyDelta}
          breakdown={healthScore.breakdown}
        />
      </div>
      <div className="mt-3 space-y-1.5">
        {healthScore.breakdown.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="w-[72px] text-[9px] text-[#737373] truncate">
              {b.label}
            </span>
            <div className="flex-1 h-1 bg-[#F2F2F2]">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${b.score}%`,
                  backgroundColor: b.color,
                }}
              />
            </div>
            <span className="w-6 text-right font-mono text-[9px] font-semibold text-[#0D0D0D]">
              {b.score}
            </span>
          </div>
        ))}
      </div>

      <ViewDetailsLink onClick={() => onSelectSection("fleet-health")} />
    </div>
  );
}

/* ─── B. Performance Intelligence ─── */

function PerformanceContent({
  onSelectSection,
}: {
  onSelectSection: (section: string) => void;
}) {
  const underperformers = benchmarks
    .filter((b) => b.status === "underperforming")
    .slice(0, 3);

  return (
    <div className="dashed-card p-3 space-y-3">
      {/* Fleet PR */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">
            Fleet PR
          </p>
          <p className="font-mono text-lg font-bold text-[#0D0D0D]">81.4%</p>
        </div>
        <div className="flex items-center gap-1 text-[#22C55E]">
          <TrendingUp className="h-3 w-3" />
          <span className="font-mono text-[10px] font-semibold">+0.3%</span>
        </div>
      </div>

      {/* Top 3 underperformers */}
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-1.5">
          Top Underperformers
        </p>
        <div className="space-y-1.5">
          {underperformers.map((m) => (
            <div
              key={m.moduleId}
              className="flex items-center justify-between bg-[#F2F2F2] px-2 py-1.5"
            >
              <span className="font-mono text-[9px] text-[#0D0D0D] truncate max-w-[120px]">
                {m.moduleId}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-semibold text-[#0D0D0D]">
                  {m.pr}%
                </span>
                <span className="font-mono text-[8px] font-bold text-[#DC2626]">
                  {m.delta}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-day forecast sparkline */}
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-1">
          30-Day Forecast
        </p>
        <div className="flex items-center gap-2">
          <Sparkline
            data={forecast.pr30dForecast}
            width={160}
            height={24}
            color="#22C55E"
          />
          <span className="font-mono text-[10px] font-bold text-[#22C55E]">
            {forecast.pr30dForecast[forecast.pr30dForecast.length - 1]}%
          </span>
        </div>
      </div>

      <ViewDetailsLink onClick={() => onSelectSection("performance")} />
    </div>
  );
}

/* ─── C. Degradation & Warranty ─── */

function DegradationContent({
  onSelectSection,
}: {
  onSelectSection: (section: string) => void;
}) {
  const claimReadyCount = warranty.claimReady.length;
  const elevatedSupplier = provenance.supplierDegradation.find(
    (s) => s.risk === "elevated",
  );

  return (
    <div className="dashed-card p-3 space-y-3">
      {/* Degradation rate badge */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">
            Degradation Rate
          </p>
          <p className="font-mono text-lg font-bold text-[#0D0D0D]">
            0.38<span className="text-xs text-[#737373]">%/yr</span>
          </p>
        </div>
        <span className="bg-[#DCFCE7] px-1.5 py-0.5 text-[8px] font-bold text-[#166534]">
          Normal
        </span>
      </div>

      {/* Next cleaning countdown */}
      <div className="flex items-center gap-3">
        <CountdownRing days={maintenance.nextCleaning.daysUntil} max={30} />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-[#0D0D0D]">
            Next Cleaning
          </p>
          <p className="text-[9px] text-[#737373]">
            {maintenance.nextCleaning.daysUntil} days remaining
          </p>
        </div>
      </div>

      {/* Warranty claim candidates */}
      <div className="flex items-center justify-between bg-[#FEF3C7] px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3 text-[#92400E]" />
          <span className="text-[10px] font-semibold text-[#92400E]">
            {claimReadyCount} claim-ready
          </span>
        </div>
        <span className="font-mono text-[9px] text-[#92400E]">
          {warranty.claimReady.reduce(
            (s, c) => s + c.estimatedClaimValueEur,
            0,
          ).toLocaleString("en-EU")}
        </span>
      </div>

      {/* Top provenance alert */}
      {elevatedSupplier && (
        <div className="bg-[#F2F2F2] px-2 py-1.5">
          <p className="text-[9px] font-semibold text-[#0D0D0D]">
            Provenance Alert
          </p>
          <p className="text-[9px] text-[#737373] mt-0.5">
            <span className="font-mono text-[#F59E0B]">
              {elevatedSupplier.supplierId}
            </span>
            : elevated degradation ({elevatedSupplier.avgDegradationRate}%/yr)
          </p>
        </div>
      )}

      <ViewDetailsLink onClick={() => onSelectSection("degradation")} />
    </div>
  );
}

/* ─── D. Soiling & Environmental ─── */

function SoilingContent({
  onSelectSection,
}: {
  onSelectSection: (section: string) => void;
}) {
  const soilingDriver = revenue.lossDrivers.find(
    (d) => d.category === "Soiling",
  );
  const clippingDriver = revenue.lossDrivers.find(
    (d) => d.category === "Clipping",
  );

  return (
    <div className="dashed-card p-3 space-y-3">
      {/* Current soiling loss */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">
            Soiling Loss
          </p>
          <p className="font-mono text-lg font-bold text-[#F59E0B]">
            {maintenance.nextCleaning.estimatedSoilingAtCleaning}%
          </p>
        </div>
        {soilingDriver && (
          <div className="flex items-center gap-1">
            {soilingDriver.trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-[#DC2626]" />
            ) : (
              <TrendingDown className="h-3 w-3 text-[#22C55E]" />
            )}
            <span className="font-mono text-[10px] font-semibold text-[#DC2626]">
              Rising
            </span>
          </div>
        )}
      </div>

      {/* Cleaning ROI summary */}
      <div className="bg-[#F2F2F2] px-2 py-2 space-y-1">
        <p className="text-[9px] font-semibold text-[#0D0D0D]">Cleaning ROI</p>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-[#737373]">
            Cost: €{maintenance.maintenanceROI.cleaningCostEur}
          </span>
          <span className="text-[9px] text-[#737373]">
            Saves: €{maintenance.maintenanceROI.annualSavingsEur}/yr
          </span>
        </div>
        <p className="font-mono text-[10px] font-bold text-[#22C55E]">
          {maintenance.maintenanceROI.paybackDays}-day payback
        </p>
      </div>

      {/* Clipping hours badge */}
      {clippingDriver && (
        <div className="flex items-center justify-between bg-[#EFF6FF] px-2 py-1.5">
          <span className="text-[9px] font-semibold text-[#1E40AF]">
            Inverter Clipping
          </span>
          <span className="font-mono text-[10px] font-bold text-[#1E40AF]">
            €{clippingDriver.euroPerMonth.toFixed(1)}/mo
          </span>
        </div>
      )}

      <ViewDetailsLink onClick={() => onSelectSection("soiling")} />
    </div>
  );
}

/* ─── E. Revenue & Carbon ─── */

function RevenueContent({
  onSelectSection,
}: {
  onSelectSection: (section: string) => void;
}) {
  const topDrivers = revenue.lossDrivers.slice(0, 2);

  return (
    <div className="dashed-card p-3 space-y-3">
      {/* Monthly loss */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">
            Monthly Loss
          </p>
          <p className="font-mono text-lg font-bold text-[#EF4444]">
            €{revenue.monthlyLoss}/mo
          </p>
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">
            Annual
          </p>
          <p className="font-mono text-[11px] font-semibold text-[#0D0D0D]">
            €{revenue.annualProjected}
          </p>
        </div>
      </div>

      {/* Top 2 loss drivers */}
      <div className="space-y-2">
        {topDrivers.map((d) => (
          <LossDriverBar key={d.category} {...d} />
        ))}
      </div>

      {/* Carbon vs benchmark */}
      <div className="bg-[#F2F2F2] px-2 py-2 space-y-1">
        <p className="text-[9px] font-semibold text-[#0D0D0D]">
          Carbon Footprint
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm font-bold text-[#0D0D0D]">
              {carbon.currentAvgKgCO2e}{" "}
              <span className="text-[8px] font-normal text-[#737373]">
                kg CO₂e
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-[#A3A3A3]">Benchmark</p>
            <p className="font-mono text-[10px] font-semibold text-[#737373]">
              {carbon.industryBenchmark} kg
            </p>
          </div>
        </div>
        <div className="h-1.5 w-full bg-[#E5E5E5]">
          <div
            className="h-full bg-[#F59E0B] transition-all duration-500"
            style={{
              width: `${Math.min((carbon.currentAvgKgCO2e / (carbon.industryBenchmark * 1.5)) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      <ViewDetailsLink onClick={() => onSelectSection("revenue")} />
    </div>
  );
}

/* ─── F. Compliance & Risk ─── */

function ComplianceContent({
  onSelectSection,
}: {
  onSelectSection: (section: string) => void;
}) {
  const unresolvedAnomalies = anomalies.filter((a) => !a.resolved);
  const topInsight = insights.reduce<(typeof insights)[number] | null>(
    (best, ins) => {
      const severityOrder = { critical: 0, warning: 1, info: 2, success: 3 };
      if (
        !best ||
        severityOrder[ins.severity] < severityOrder[best.severity]
      ) {
        return ins;
      }
      return best;
    },
    null,
  );

  const highRiskCount = complianceRisks.filter(
    (r) => r.riskLevel === "high",
  ).length;
  const mediumRiskCount = complianceRisks.filter(
    (r) => r.riskLevel === "medium",
  ).length;

  return (
    <div className="dashed-card p-3 space-y-3">
      {/* Unresolved anomalies count */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">
            Unresolved Anomalies
          </p>
          <p className="font-mono text-lg font-bold text-[#F59E0B]">
            {unresolvedAnomalies.length}
          </p>
        </div>
        <span
          className={cn(
            "px-1.5 py-0.5 text-[8px] font-bold",
            unresolvedAnomalies.length > 2
              ? "bg-[#FEE2E2] text-[#B91C1C]"
              : "bg-[#FEF3C7] text-[#92400E]",
          )}
        >
          {unresolvedAnomalies.length > 2 ? "Needs Attention" : "Monitoring"}
        </span>
      </div>

      {/* Top insight (highest severity) */}
      {topInsight && (
        <div className="bg-[#F2F2F2] px-2 py-2 space-y-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "px-1 py-0.5 text-[7px] font-bold uppercase leading-none tracking-wide",
                topInsight.severity === "critical"
                  ? "bg-[#FEE2E2] text-[#B91C1C]"
                  : topInsight.severity === "warning"
                    ? "bg-[#FEF3C7] text-[#92400E]"
                    : "bg-[#EFF6FF] text-[#1E40AF]",
              )}
            >
              {topInsight.severity}
            </span>
            <span className="font-mono text-[8px] text-[#A3A3A3]">
              {topInsight.confidence}% conf
            </span>
          </div>
          <p className="text-[10px] font-semibold leading-tight text-[#0D0D0D]">
            {topInsight.title}
          </p>
        </div>
      )}

      {/* Compliance risk counts */}
      <div className="flex items-center gap-2">
        {highRiskCount > 0 && (
          <div className="flex items-center gap-1 bg-[#FEE2E2] px-2 py-1">
            <AlertTriangle className="h-2.5 w-2.5 text-[#B91C1C]" />
            <span className="text-[9px] font-bold text-[#B91C1C]">
              {highRiskCount} high
            </span>
          </div>
        )}
        {mediumRiskCount > 0 && (
          <div className="flex items-center gap-1 bg-[#FEF3C7] px-2 py-1">
            <AlertTriangle className="h-2.5 w-2.5 text-[#92400E]" />
            <span className="text-[9px] font-bold text-[#92400E]">
              {mediumRiskCount} medium
            </span>
          </div>
        )}
      </div>

      <ViewDetailsLink onClick={() => onSelectSection("compliance")} />
    </div>
  );
}

/* ─── Shared "View Details" link ─── */

function ViewDetailsLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[10px] font-semibold text-[#22C55E] hover:text-[#0D0D0D] transition-colors"
    >
      View Details
      <ArrowRight className="h-2.5 w-2.5" />
    </button>
  );
}
