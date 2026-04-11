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
  return "text-primary";
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
      <aside className="hidden xl:flex w-10 shrink-0 flex-col items-center border-l border-border bg-muted/50 py-3">
        <button
          onClick={() => setExpanded(true)}
          className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Expand intelligence panel"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="mt-3 space-y-3 flex flex-col items-center">
          <Brain className="h-4 w-4 text-primary" />
          {/* Mini health indicator */}
          <div
            className="h-6 w-1.5"
            style={{
              background: `linear-gradient(to top, var(--primary) ${healthScore.overall}%, var(--muted) ${healthScore.overall}%)`,
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
    <aside className="hidden xl:flex w-[300px] shrink-0 flex-col border-l border-border bg-muted/50 transition-all duration-200 overflow-y-auto">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-4 w-4 text-primary" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 bg-primary animate-pulse" />
          </div>
          <span className="text-sm font-bold text-foreground">
            AI Intelligence
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-muted-foreground/70">Live</span>
          <button
            onClick={() => setExpanded(false)}
            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
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
                  <span className="w-[72px] text-[9px] text-muted-foreground truncate">
                    {b.label}
                  </span>
                  <div className="flex-1 h-1 bg-muted">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${b.score}%`,
                        backgroundColor: b.color,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-[9px] font-semibold text-foreground">
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
                  ? "bg-foreground text-background"
                  : "text-muted-foreground/70 hover:text-muted-foreground",
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
                  ? "bg-foreground text-background"
                  : "text-muted-foreground/70 hover:text-muted-foreground",
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
            <div className="dashed-card divide-y divide-dashed divide-border">
              {insights.slice(0, insightLimit).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
              {insightLimit < insights.length && (
                <button
                  onClick={() => setInsightLimit(insights.length)}
                  className="flex w-full items-center justify-center gap-1 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Show {insights.length - insightLimit} more
                  <ArrowRight className="h-2.5 w-2.5" />
                </button>
              )}
              {insightLimit >= insights.length && insights.length > 3 && (
                <button
                  onClick={() => setInsightLimit(3)}
                  className="flex w-full items-center justify-center gap-1 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Show less
                </button>
              )}
            </div>
          ) : (
            <div className="dashed-card divide-y divide-dashed divide-border">
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
                <p className="text-[11px] font-semibold text-foreground">
                  Next Cleaning
                </p>
                <p className="text-[9px] text-muted-foreground">
                  Est. soiling at cleaning: {maintenance.nextCleaning.estimatedSoilingAtCleaning}%
                </p>
                <p className="text-[9px] text-[#F59E0B] font-semibold">
                  {fmtEur(maintenance.nextCleaning.costIfDelayed)}/mo if delayed
                </p>
              </div>
            </div>

            <div className="h-px bg-dashed bg-border" style={{ backgroundImage: "repeating-linear-gradient(to right, var(--border) 0, var(--border) 4px, transparent 4px, transparent 8px)" }} />

            {/* Component risk */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-foreground">Component Risk</p>
                <span className="flex items-center gap-1 text-[9px] font-semibold text-[#F59E0B]">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {maintenance.componentRisk.modulesAtRisk} modules
                </span>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="bg-muted/50 p-1.5">
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground/70">30-day</p>
                  <p className="font-mono text-sm font-bold text-foreground">
                    {maintenance.componentRisk.failureProbability30d}%
                  </p>
                </div>
                <div className="bg-muted/50 p-1.5">
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground/70">90-day</p>
                  <p className="font-mono text-sm font-bold text-[#F59E0B]">
                    {maintenance.componentRisk.failureProbability90d}%
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px" style={{ backgroundImage: "repeating-linear-gradient(to right, var(--border) 0, var(--border) 4px, transparent 4px, transparent 8px)" }} />

            {/* Maintenance ROI */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-foreground">Maintenance ROI</p>
                <p className="text-[9px] text-muted-foreground">
                  {fmtEur(maintenance.maintenanceROI.cleaningCostEur)} cost → {fmtEur(maintenance.maintenanceROI.annualSavingsEur)}/yr saved
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-primary">
                  {maintenance.maintenanceROI.paybackDays}d
                </p>
                <p className="text-[8px] text-muted-foreground/70">payback</p>
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
                <p className="text-[8px] uppercase tracking-wider text-muted-foreground/70">Monthly Loss</p>
                <p className="font-mono text-sm font-bold text-[#EF4444]">
                  {fmtEur(revenue.monthlyLoss)}
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-wider text-muted-foreground/70">Annual Proj.</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {fmtEur(revenue.annualProjected)}
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-wider text-muted-foreground/70">Potential</p>
                <p className="font-mono text-sm font-bold text-primary">
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
            <p className="text-[7px] text-muted-foreground/70 mt-1.5 leading-tight">
              * Assumes €0.15/kWh tariff
            </p>
          </div>
        </section>

        {/* ── 5. Performance Forecast ── */}
        <section>
          <SectionHeader icon={Target}>Performance Forecast</SectionHeader>
          <div className="dashed-card p-3 space-y-3">
            {/* PR 30d forecast sparkline */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-foreground">
                  30-Day PR Forecast
                </p>
                <span className="font-mono text-[10px] font-bold text-primary">
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
                  <p className="text-[8px] text-muted-foreground/70">Target</p>
                  <p className="font-mono text-[10px] font-semibold text-muted-foreground">
                    {forecast.prTarget}%
                  </p>
                </div>
              </div>
            </div>

            {/* Degradation mini trajectory */}
            <div>
              <p className="text-[10px] font-semibold text-foreground">
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
                      <span className="mt-0.5 text-[7px] text-muted-foreground/70">
                        Y{d.year}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-1 text-[8px] text-muted-foreground">
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
                className="flex flex-col items-center gap-1.5 border border-dashed border-border bg-card px-2 py-3 text-muted-foreground transition-all duration-150 hover:border-primary hover:bg-[var(--passport-green-muted)] hover:text-foreground"
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
          <div className="dashed-card divide-y divide-dashed divide-border">
            {DEADLINES.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2.5 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6875rem] leading-snug text-foreground">
                    {d.label}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1 text-[0.5625rem] text-muted-foreground/70">
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
    <div className="mb-1.5 flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </div>
  );
}
