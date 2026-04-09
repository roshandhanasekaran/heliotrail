"use client";

import {
  FileStack,
  TrendingUp,
  ShieldCheck,
  Leaf,
  Layers,
  FolderOpen,
  Gauge,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Sparkline } from "@/components/shared/sparkline";

interface KpiData {
  total: number;
  published: number;
  complianceScore: number;
  avgCarbon: number;
  materialsCount: number;
  evidencePercent: number;
  crmCount: number;
  socCount: number;
}

export function DashboardKpis({ data }: { data: KpiData }) {
  const publishedRate =
    data.total > 0 ? Math.round((data.published / data.total) * 100) : 0;

  const heroKpis = [
    {
      icon: FileStack,
      label: "Total Passports",
      value: data.total,
      suffix: "",
      sub: `${data.published} published · ${data.total - data.published} in progress`,
      trend: "+2 this quarter",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [3, 4, 4, 5, 6, 7, 8],
      isPrimary: true,
    },
    {
      icon: ShieldCheck,
      label: "Compliance Score",
      value: data.complianceScore,
      suffix: "%",
      sub: "certificates valid across portfolio",
      trend: "Stable",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [90, 91, 93, 94, 94, 95, 95],
      isPrimary: false,
    },
  ];

  const secondaryKpis = [
    {
      icon: TrendingUp,
      label: "Published Rate",
      value: publishedRate,
      suffix: "%",
      trend: "+12% QoQ",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [40, 42, 48, 50, 55, 58, 63],
    },
    {
      icon: Leaf,
      label: "Avg Carbon",
      value: data.avgCarbon,
      suffix: "",
      trend: "-3% vs batch",
      trendUp: false,
      accentColor: "#22C55E",
      sparkData: [440, 430, 425, 420, 415, 412, 410],
    },
    {
      icon: Layers,
      label: "Materials",
      value: data.materialsCount,
      suffix: "",
      trend: `${data.crmCount} CRM`,
      trendUp: true,
      accentColor: "#F59E0B",
      sparkData: [20, 25, 30, 33, 36, 40, 42],
    },
    {
      icon: FolderOpen,
      label: "Evidence",
      value: data.evidencePercent,
      suffix: "%",
      trend: "+8% this mo.",
      trendUp: true,
      accentColor: "#3B82F6",
      sparkData: [60, 65, 70, 75, 78, 82, 87],
    },
    {
      icon: Gauge,
      label: "Fleet PR",
      value: 81,
      suffix: "%",
      trend: "Stable",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [83, 82, 80, 82, 82, 81],
    },
    {
      icon: AlertTriangle,
      label: "Active Alerts",
      value: 3,
      suffix: "",
      trend: "2 new",
      trendUp: false,
      accentColor: "#F59E0B",
      sparkData: [1, 0, 2, 1, 3, 3],
    },
  ];

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#0D0D0D]">
          Portfolio Intelligence
        </h2>
        <div className="flex items-center gap-1.5 text-[#A3A3A3]">
          <Clock className="h-3 w-3" />
          <span className="text-[0.625rem]">Updated 5 min ago</span>
        </div>
      </div>

      {/* Hero KPI cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {heroKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="clean-card hover-card group cursor-default p-5"
            style={{
              borderLeft: kpi.isPrimary
                ? "2px solid #22C55E"
                : "1px solid #D9D9D9",
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center"
                  style={{ backgroundColor: `${kpi.accentColor}0A` }}
                >
                  <kpi.icon
                    className="h-4 w-4"
                    style={{ color: kpi.accentColor }}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#737373]">
                    {kpi.label}
                  </p>
                  <span
                    className={`text-[0.625rem] font-medium ${
                      kpi.trendUp ? "text-[#22C55E]" : "text-[#EF4444]"
                    }`}
                  >
                    {kpi.trendUp ? "\u2191" : "\u2193"} {kpi.trend}
                  </span>
                </div>
              </div>
              <Sparkline
                data={kpi.sparkData}
                color={kpi.accentColor}
                width={64}
                height={24}
              />
            </div>
            <div className="mt-4">
              <AnimatedCounter
                value={kpi.value}
                suffix={kpi.suffix}
                className="font-mono text-[2.5rem] font-bold leading-none tabular-nums text-[#0D0D0D]"
              />
            </div>
            <p className="mt-1.5 text-[0.6875rem] text-[#A3A3A3]">
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Secondary KPI strip */}
      <div className="clean-card overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-[#D9D9D9] sm:grid-cols-3 lg:grid-cols-6">
          {secondaryKpis.map((kpi, i) => (
            <div
              key={kpi.label}
              className={`group cursor-default px-4 py-3.5 transition-colors hover:bg-[#FAFAFA] ${
                i >= 2 ? "border-t border-[#D9D9D9] sm:border-t-0" : ""
              } ${i >= 3 ? "lg:border-t-0" : ""}`}
            >
              <div className="flex items-center justify-between">
                <kpi.icon className="h-3.5 w-3.5 text-[#A3A3A3]" />
                <Sparkline data={kpi.sparkData} color={kpi.accentColor} />
              </div>
              <div className="mt-2">
                <AnimatedCounter
                  value={kpi.value}
                  suffix={kpi.suffix}
                  className="font-mono text-xl font-bold leading-none tabular-nums text-[#0D0D0D]"
                />
              </div>
              <p className="mt-1 text-[0.625rem] font-medium text-[#737373]">
                {kpi.label}
              </p>
              <span
                className={`text-[0.625rem] ${
                  kpi.trendUp ? "text-[#22C55E]" : "text-[#F59E0B]"
                }`}
              >
                {kpi.trendUp ? "\u2191" : "\u2193"} {kpi.trend}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
