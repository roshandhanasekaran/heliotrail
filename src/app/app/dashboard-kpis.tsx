"use client";

import {
  FileStack,
  TrendingUp,
  ShieldCheck,
  Leaf,
  Layers,
  FolderOpen,
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

  const kpis = [
    {
      icon: FileStack,
      label: "Total Passports",
      value: data.total,
      suffix: "",
      sub: `${data.published} published`,
      trend: "+2 this quarter",
      trendUp: true,
      accentColor: "#0D0D0D",
      sparkData: [3, 4, 4, 5, 6, 7, 8],
    },
    {
      icon: TrendingUp,
      label: "Published Rate",
      value: publishedRate,
      suffix: "%",
      sub: `${data.published} of ${data.total}`,
      trend: "+12% QoQ",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [40, 42, 48, 50, 55, 58, 63],
    },
    {
      icon: ShieldCheck,
      label: "Compliance",
      value: data.complianceScore,
      suffix: "%",
      sub: "certificates valid",
      trend: "Stable",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [90, 91, 93, 94, 94, 95, 95],
    },
    {
      icon: Leaf,
      label: "Avg Carbon",
      value: data.avgCarbon,
      suffix: "",
      sub: "kg CO₂e / module",
      trend: "-3% vs last batch",
      trendUp: false,
      accentColor: "#22C55E",
      sparkData: [440, 430, 425, 420, 415, 412, 410],
    },
    {
      icon: Layers,
      label: "Materials",
      value: data.materialsCount,
      suffix: "",
      sub: `${data.crmCount} CRM · ${data.socCount} SoC`,
      trend: "Fully tracked",
      trendUp: true,
      accentColor: "#F59E0B",
      sparkData: [20, 25, 30, 33, 36, 40, 42],
    },
    {
      icon: FolderOpen,
      label: "Evidence",
      value: data.evidencePercent,
      suffix: "%",
      sub: "passports with docs",
      trend: "+8% this month",
      trendUp: true,
      accentColor: "#3B82F6",
      sparkData: [60, 65, 70, 75, 78, 82, 87],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="clean-card hover-card group cursor-default p-4"
          style={{ borderTop: `2px dashed ${kpi.accentColor}20` }}
        >
          <div className="flex items-center justify-between">
            <kpi.icon className="h-4 w-4 text-[#737373]" />
            <Sparkline data={kpi.sparkData} color={kpi.accentColor} />
          </div>
          <div className="mt-3">
            <AnimatedCounter
              value={kpi.value}
              suffix={kpi.suffix}
              className="text-[1.75rem] font-bold leading-none tabular-nums text-[#0D0D0D]"
            />
          </div>
          <p className="mt-1 text-xs text-[#737373]">{kpi.label}</p>
          <p className="text-[0.625rem] text-[#A3A3A3]">{kpi.sub}</p>
          <div className="mt-2 flex items-center gap-1">
            <span
              className={`text-[0.625rem] font-medium ${
                kpi.trendUp ? "text-[#22C55E]" : "text-[#22C55E]"
              }`}
            >
              {kpi.trendUp ? "↑" : "↓"} {kpi.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
