"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Plus,
  CheckSquare,
  Upload,
  BarChart3,
  Calendar,
  Sparkles,
  Wrench,
  Euro,
  Activity,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";
import { Sparkline } from "@/components/shared/sparkline";
import {
  getFleetHealthScore,
  getAIInsights,
  getMaintenancePredictions,
  getRevenueIntelligence,
  getPerformanceForecast,
  getAnomalyStream,
} from "@/lib/mock/ai-analytics";

import { FleetHealthGauge } from "@/components/app/ai-analytics/shared/fleet-health-gauge";
import { CountdownRing } from "@/components/app/ai-analytics/shared/countdown-ring";
import { LossDriverBar } from "@/components/app/ai-analytics/shared/loss-driver-bar";
import { InsightCard } from "@/components/app/ai-analytics/shared/insight-card";
import { AnomalyCard } from "@/components/app/ai-analytics/shared/anomaly-card";

/* ─── Data ─── */

const healthScore = getFleetHealthScore();
const insights = getAIInsights();
const maintenance = getMaintenancePredictions();
const revenue = getRevenueIntelligence();
const forecast = getPerformanceForecast();
const anomalies = getAnomalyStream();

const QUICK_ACTIONS = [
  { label: "Create Passport", href: "/app/passports/new", icon: Plus },
  { label: "View Approvals", href: "/app/approvals", icon: CheckSquare },
  { label: "Upload Evidence", href: "/app/evidence", icon: Upload },
  { label: "Run Audit", href: "/app/analytics", icon: BarChart3 },
];

const DEADLINES = [
  { label: "IEC 61730 renewal due", date: "May 15, 2026", days: 36 },
  { label: "EU DPP Registry opens", date: "Jul 19, 2026", days: 78 },
  { label: "Q2 compliance review", date: "Jun 30, 2026", days: 82 },
];

/* ─── Helpers ─── */

function fmtEur(v: number): string {
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1_000) return `€${(v / 1_000).toFixed(1)}k`;
  return `€${v.toFixed(0)}`;
}

function daysColor(d: number): string {
  if (d < 30) return "text-[#DC2626]";
  if (d < 60) return "text-[#F59E0B]";
  return "text-[#22C55E]";
}

/* ─── Main component ─── */

export function IntelligenceSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [isXl, setIsXl] = useState(true);
  const [insightLimit, setInsightLimit] = useState(3);
  const [activeTab, setActiveTab] = useState<"insights" | "anomalies">("insights");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsXl(e.matches);
      if (!e.matches) setExpanded(false);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isXl) return null;

  /* ── Collapsed strip ── */
  if (!expanded) {
    return (
      <aside className="hidden xl:flex w-10 shrink-0 flex-col items-center border-l border-[#D9D9D9] bg-[#FAFAFA] py-3">
        <button
          onClick={() => setExpanded(true)}
          className="flex h-8 w-8 items-center justify-center text-[#737373] transition-colors hover:text-[#0D0D0D]"
          aria-label="Expand intelligence panel"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="mt-3 space-y-3 flex flex-col items-center">
          <Brain className="h-4 w-4 text-[#22C55E]" />
          {/* Mini health indicator */}
          <div
            className="h-6 w-1.5"
            style={{
              background: `linear-gradient(to top, #22C55E ${healthScore.overall}%, #F2F2F2 ${healthScore.overall}%)`,
            }}
          />
          {/* Unresolved count */}
          {anomalies.filter((a) => !a.resolved).length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center bg-[#FEE2E2] text-[7px] font-bold text-[#B91C1C]">
              {anomalies.filter((a) => !a.resolved).length}
            </span>
          )}
        </div>
      </aside>
    );
  }

  /* ── Expanded panel ── */
  return (
    <aside className="hidden xl:flex w-[300px] shrink-0 flex-col border-l border-[#D9D9D9] bg-[#FAFAFA] transition-all duration-200 overflow-y-auto">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-[#D9D9D9] px-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-4 w-4 text-[#22C55E]" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 bg-[#22C55E] animate-pulse" />
          </div>
          <span className="text-sm font-bold text-[#0D0D0D]">
            AI Intelligence
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-[#A3A3A3]">Live</span>
          <button
            onClick={() => setExpanded(false)}
            className="flex h-7 w-7 items-center justify-center text-[#737373] transition-colors hover:text-[#0D0D0D]"
            aria-label="Collapse intelligence panel"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 px-3 py-3">
        {/* ── 1. Fleet Health Score ── */}
        <section>
          <SectionHeader icon={Activity}>Fleet Health</SectionHeader>
          <div className="dashed-card p-3">
            <div className="flex justify-center">
              <FleetHealthGauge score={healthScore.overall} delta={healthScore.weeklyDelta} breakdown={healthScore.breakdown} />
            </div>
            {/* Breakdown mini bars */}
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
          </div>
        </section>

        {/* ── 2. AI Insights / Anomaly Stream Tab ── */}
        <section>
          <div className="mb-1.5 flex items-center gap-0">
            <button
              onClick={() => setActiveTab("insights")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors",
                activeTab === "insights"
                  ? "bg-[#0D0D0D] text-white"
                  : "text-[#A3A3A3] hover:text-[#737373]",
              )}
            >
              <Sparkles className="h-2.5 w-2.5" />
              Insights
            </button>
            <button
              onClick={() => setActiveTab("anomalies")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors",
                activeTab === "anomalies"
                  ? "bg-[#0D0D0D] text-white"
                  : "text-[#A3A3A3] hover:text-[#737373]",
              )}
            >
              <Zap className="h-2.5 w-2.5" />
              Anomalies
              {anomalies.filter((a) => !a.resolved).length > 0 && (
                <span className="ml-0.5 flex h-3.5 min-w-[14px] items-center justify-center bg-[#FEE2E2] px-1 text-[8px] font-bold text-[#B91C1C]">
                  {anomalies.filter((a) => !a.resolved).length}
                </span>
              )}
            </button>
          </div>

          {activeTab === "insights" ? (
            <div className="dashed-card divide-y divide-dashed divide-[#D9D9D9]">
              {insights.slice(0, insightLimit).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
              {insightLimit < insights.length && (
                <button
                  onClick={() => setInsightLimit(insights.length)}
                  className="flex w-full items-center justify-center gap-1 py-2 text-[10px] font-medium text-[#737373] hover:text-[#0D0D0D] transition-colors"
                >
                  Show {insights.length - insightLimit} more
                  <ArrowRight className="h-2.5 w-2.5" />
                </button>
              )}
              {insightLimit >= insights.length && insights.length > 3 && (
                <button
                  onClick={() => setInsightLimit(3)}
                  className="flex w-full items-center justify-center gap-1 py-2 text-[10px] font-medium text-[#737373] hover:text-[#0D0D0D] transition-colors"
                >
                  Show less
                </button>
              )}
            </div>
          ) : (
            <div className="dashed-card divide-y divide-dashed divide-[#D9D9D9]">
              {anomalies.map((anomaly) => (
                <AnomalyCard key={anomaly.id} anomaly={anomaly} />
              ))}
            </div>
          )}
        </section>

        {/* ── 3. Predictive Maintenance ── */}
        <section>
          <SectionHeader icon={Wrench}>Predictive Maintenance</SectionHeader>
          <div className="dashed-card p-3 space-y-3">
            {/* Next cleaning */}
            <div className="flex items-center gap-3">
              <CountdownRing days={maintenance.nextCleaning.daysUntil} max={30} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-[#0D0D0D]">
                  Next Cleaning
                </p>
                <p className="text-[9px] text-[#737373]">
                  Est. soiling at cleaning: {maintenance.nextCleaning.estimatedSoilingAtCleaning}%
                </p>
                <p className="text-[9px] text-[#F59E0B] font-semibold">
                  {fmtEur(maintenance.nextCleaning.costIfDelayed)}/mo if delayed
                </p>
              </div>
            </div>

            <div className="h-px bg-dashed bg-[#E5E5E5]" style={{ backgroundImage: "repeating-linear-gradient(to right, #D9D9D9 0, #D9D9D9 4px, transparent 4px, transparent 8px)" }} />

            {/* Component risk */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-[#0D0D0D]">Component Risk</p>
                <span className="flex items-center gap-1 text-[9px] font-semibold text-[#F59E0B]">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {maintenance.componentRisk.modulesAtRisk} modules
                </span>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="bg-[#FAFAFA] p-1.5">
                  <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">30-day</p>
                  <p className="font-mono text-sm font-bold text-[#0D0D0D]">
                    {maintenance.componentRisk.failureProbability30d}%
                  </p>
                </div>
                <div className="bg-[#FAFAFA] p-1.5">
                  <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">90-day</p>
                  <p className="font-mono text-sm font-bold text-[#F59E0B]">
                    {maintenance.componentRisk.failureProbability90d}%
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px" style={{ backgroundImage: "repeating-linear-gradient(to right, #D9D9D9 0, #D9D9D9 4px, transparent 4px, transparent 8px)" }} />

            {/* Maintenance ROI */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-[#0D0D0D]">Maintenance ROI</p>
                <p className="text-[9px] text-[#737373]">
                  {fmtEur(maintenance.maintenanceROI.cleaningCostEur)} cost → {fmtEur(maintenance.maintenanceROI.annualSavingsEur)}/yr saved
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-[#22C55E]">
                  {maintenance.maintenanceROI.paybackDays}d
                </p>
                <p className="text-[8px] text-[#A3A3A3]">payback</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Revenue Intelligence ── */}
        <section>
          <SectionHeader icon={Euro}>Revenue Intelligence</SectionHeader>
          <div className="dashed-card p-3 space-y-3">
            {/* Top stats */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">Monthly Loss</p>
                <p className="font-mono text-sm font-bold text-[#EF4444]">
                  {fmtEur(revenue.monthlyLoss)}
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">Annual Proj.</p>
                <p className="font-mono text-sm font-bold text-[#0D0D0D]">
                  {fmtEur(revenue.annualProjected)}
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-wider text-[#A3A3A3]">Potential</p>
                <p className="font-mono text-sm font-bold text-[#22C55E]">
                  +{fmtEur(revenue.optimizationPotential)}
                </p>
              </div>
            </div>

            {/* Loss driver bars */}
            <div className="space-y-2">
              {revenue.lossDrivers.map((d) => (
                <LossDriverBar key={d.category} {...d} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Performance Forecast ── */}
        <section>
          <SectionHeader icon={Target}>Performance Forecast</SectionHeader>
          <div className="dashed-card p-3 space-y-3">
            {/* PR 30d forecast sparkline */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-[#0D0D0D]">
                  30-Day PR Forecast
                </p>
                <span className="font-mono text-[10px] font-bold text-[#22C55E]">
                  →{forecast.pr30dForecast[forecast.pr30dForecast.length - 1]}%
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Sparkline
                  data={forecast.pr30dForecast}
                  width={180}
                  height={28}
                  color="#22C55E"
                />
                <div className="text-right">
                  <p className="text-[8px] text-[#A3A3A3]">Target</p>
                  <p className="font-mono text-[10px] font-semibold text-[#737373]">
                    {forecast.prTarget}%
                  </p>
                </div>
              </div>
            </div>

            {/* Degradation mini trajectory */}
            <div>
              <p className="text-[10px] font-semibold text-[#0D0D0D]">
                Degradation vs Warranty
              </p>
              <div className="mt-1 grid grid-cols-6 gap-0.5">
                {forecast.degradationTrajectory.map((d) => {
                  const gap = d.actual - d.warranty;
                  const barH = Math.max(4, gap * 2);
                  return (
                    <div key={d.year} className="flex flex-col items-center">
                      <div
                        className="w-full transition-all duration-300"
                        style={{
                          height: `${barH}px`,
                          backgroundColor:
                            gap > 5 ? "#22C55E" : gap > 2 ? "#F59E0B" : "#EF4444",
                        }}
                      />
                      <span className="mt-0.5 text-[7px] text-[#A3A3A3]">
                        Y{d.year}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-1 text-[8px] text-[#737373]">
                Buffer above warranty minimum
              </p>
            </div>

            {/* Seasonal outlook */}
            <div className="bg-[#F0FDF4] p-2">
              <p className="text-[9px] leading-snug text-[#166534]">
                <Sparkles className="mr-0.5 inline h-2.5 w-2.5" />
                {forecast.seasonalOutlook}
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. Quick Actions ── */}
        <section>
          <SectionHeader icon={Zap}>Quick Actions</SectionHeader>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-1.5 border border-dashed border-[#D9D9D9] bg-white px-2 py-3 text-[#737373] transition-all duration-150 hover:border-[#22C55E] hover:bg-[#E8FAE9] hover:text-[#0D0D0D]"
              >
                <action.icon className="h-4 w-4" />
                <span className="text-[0.625rem] font-medium leading-none">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 7. Upcoming Deadlines ── */}
        <section>
          <SectionHeader icon={Calendar}>Deadlines</SectionHeader>
          <div className="dashed-card divide-y divide-dashed divide-[#D9D9D9]">
            {DEADLINES.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2.5 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6875rem] leading-snug text-[#0D0D0D]">
                    {d.label}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1 text-[0.5625rem] text-[#A3A3A3]">
                    <Calendar className="h-2.5 w-2.5" />
                    {d.date}
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 font-mono text-[0.6875rem] font-semibold",
                    daysColor(d.days),
                  )}
                >
                  {d.days}d
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

/* ── Shared section header with icon ── */

function SectionHeader({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#A3A3A3]">
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </div>
  );
}
