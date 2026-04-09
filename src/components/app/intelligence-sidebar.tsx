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
  Shield,
} from "lucide-react";

/* ─── Demo data ─── */

const ALERTS = [
  {
    severity: "HIGH" as const,
    message: "WRM-600 PR dropped below 75%",
    time: "2h ago",
  },
  {
    severity: "MEDIUM" as const,
    message: "IEC 61730 cert expires in 30 days",
    time: "5h ago",
  },
  {
    severity: "LOW" as const,
    message: "2 passports missing carbon data",
    time: "1d ago",
  },
  {
    severity: "INFO" as const,
    message: "Soiling loss increasing — schedule cleaning",
    time: "2d ago",
  },
];

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

/* ─── Severity styling ─── */

const SEVERITY_STYLES: Record<
  "HIGH" | "MEDIUM" | "LOW" | "INFO",
  string
> = {
  HIGH: "bg-[#FEE2E2] text-[#B91C1C]",
  MEDIUM: "bg-[#FEF3C7] text-[#92400E]",
  LOW: "bg-[#DBEAFE] text-[#1E40AF]",
  INFO: "bg-[#F3F4F6] text-[#6B7280]",
};

function daysColor(d: number): string {
  if (d < 30) return "text-[#DC2626]";
  if (d < 60) return "text-[#F59E0B]";
  return "text-[#22C55E]";
}

/* ─── Compliance ring ─── */

function ComplianceRing({ value }: { value: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color =
    value > 80 ? "#22C55E" : value > 60 ? "#F59E0B" : "#DC2626";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="#E5E5E5"
          strokeWidth="6"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          transform="rotate(-90 48 48)"
          className="transition-all duration-500"
        />
        <text
          x="48"
          y="46"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-[#0D0D0D] font-mono text-lg font-bold"
          fontSize="18"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          {value}%
        </text>
        <text
          x="48"
          y="62"
          textAnchor="middle"
          className="fill-[#A3A3A3]"
          fontSize="8"
          fontFamily="DM Sans, sans-serif"
        >
          compliant
        </text>
      </svg>
      <span className="text-[0.6875rem] text-[#737373]">
        6/8 ESPR requirements met
      </span>
    </div>
  );
}

/* ─── Main component ─── */

export function IntelligenceSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [isXl, setIsXl] = useState(true);

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
        <div className="mt-3">
          <Brain className="h-4 w-4 text-[#A3A3A3]" />
        </div>
      </aside>
    );
  }

  /* ── Expanded panel ── */
  return (
    <aside className="hidden xl:flex w-[280px] shrink-0 flex-col border-l border-[#D9D9D9] bg-[#FAFAFA] transition-all duration-200 overflow-y-auto">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-[#D9D9D9] px-4">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-[#22C55E]" />
          <span className="text-sm font-bold text-[#0D0D0D]">
            Intelligence
          </span>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="flex h-7 w-7 items-center justify-center text-[#737373] transition-colors hover:text-[#0D0D0D]"
          aria-label="Collapse intelligence panel"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-4 px-3 py-3">
        {/* ── Compliance Score ── */}
        <section>
          <SectionHeader>Compliance Score</SectionHeader>
          <div className="dashed-card p-3 flex justify-center">
            <ComplianceRing value={95} />
          </div>
        </section>

        {/* ── Active Alerts ── */}
        <section>
          <SectionHeader>Active Alerts</SectionHeader>
          <div className="dashed-card divide-y divide-dashed divide-[#D9D9D9]">
            {ALERTS.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-2 px-2.5 py-2"
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase leading-none tracking-wide",
                    SEVERITY_STYLES[a.severity]
                  )}
                >
                  {a.severity}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6875rem] leading-snug text-[#0D0D0D]">
                    {a.message}
                  </p>
                  <p className="mt-0.5 text-[0.5625rem] text-[#A3A3A3]">
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick Actions ── */}
        <section>
          <SectionHeader>Quick Actions</SectionHeader>
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

        {/* ── Upcoming Deadlines ── */}
        <section>
          <SectionHeader>Upcoming Deadlines</SectionHeader>
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
                    daysColor(d.days)
                  )}
                >
                  {d.days}d
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Fleet Health Mini Stats ── */}
        <section>
          <SectionHeader>Fleet Health</SectionHeader>
          <div className="dashed-card p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-[#737373]">
                <span className="h-1.5 w-1.5 bg-[#22C55E]" />
                Passports
              </span>
              <span className="font-mono text-[0.6875rem] font-semibold text-[#0D0D0D]">
                8 total{" "}
                <span className="text-[#A3A3A3] font-normal">
                  (5 published)
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-[#737373]">
                <span className="h-1.5 w-1.5 bg-[#22C55E]" />
                Avg Carbon
              </span>
              <span className="font-mono text-[0.6875rem] font-semibold text-[#0D0D0D]">
                416 kg CO&#8322;e
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-[#737373]">
                <Shield className="h-2.5 w-2.5" />
                Evidence
              </span>
              <span className="font-mono text-[0.6875rem] font-semibold text-[#F59E0B]">
                63% complete
              </span>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}

/* ── Shared section header ── */

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#A3A3A3]">
      {children}
    </div>
  );
}
