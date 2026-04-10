"use client";

import { FileStack, ShieldCheck, Clock, Settings2 } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Sparkline } from "@/components/shared/sparkline";
import {
  KPI_REGISTRY,
  type KpiComputeInput,
} from "@/lib/kpi-registry";
import { useDashboardPreferences } from "@/hooks/use-dashboard-preferences";
import { KpiPicker } from "@/components/app/dashboard/kpi-picker";
import { useState } from "react";

export function DashboardKpis({ data }: { data: KpiComputeInput }) {
  const { preferences } = useDashboardPreferences();
  const [pickerOpen, setPickerOpen] = useState(false);

  const heroKpis = [
    {
      icon: FileStack,
      label: "Total Passports",
      value: data.total,
      suffix: "",
      sub: `${data.published} published \u00b7 ${data.total - data.published} in progress`,
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

  // Build secondary KPIs dynamically from registry + user preferences
  const secondaryKpis = preferences.enabledKpiIds
    .map((id) => KPI_REGISTRY.find((k) => k.id === id))
    .filter((m): m is NonNullable<typeof m> => m != null)
    .map((metric) => {
      const trend = metric.computeTrend(data);
      return {
        icon: metric.icon,
        label: metric.label,
        value: metric.computeValue(data),
        suffix: metric.suffix,
        trend: trend.text,
        trendUp: trend.up,
        accentColor: metric.accentColor,
        sparkData: metric.sparkSeed,
      };
    });

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#0D0D0D]">
          Portfolio Intelligence
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1 text-[#A3A3A3] transition-colors hover:text-[#0D0D0D]"
            title="Configure KPIs"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-1.5 text-[#A3A3A3]">
            <Clock className="h-3 w-3" />
            <span className="text-[0.625rem]">Updated 5 min ago</span>
          </div>
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
                    className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${
                      kpi.trendUp
                        ? "bg-green-50/80 text-[#16a34a]"
                        : "bg-red-50/80 text-[#dc2626]"
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
            <p className="mt-1.5 text-[0.6875rem] text-[#A3A3A3]">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary KPI strip */}
      {secondaryKpis.length > 0 && (
        <div className="clean-card overflow-hidden">
          <div
            className="grid grid-cols-2 divide-x divide-[#D9D9D9] sm:grid-cols-3"
            style={{
              gridTemplateColumns: undefined,
            }}
          >
            {secondaryKpis.map((kpi, i) => (
              <div
                key={kpi.label}
                className={`group cursor-default px-4 py-3.5 transition-colors hover:bg-[#FAFAFA] ${
                  i >= 2 ? "border-t border-[#D9D9D9] sm:border-t-0" : ""
                }`}
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
                  className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${
                    kpi.trendUp
                      ? "bg-green-50/80 text-[#16a34a]"
                      : "bg-amber-50/80 text-[#d97706]"
                  }`}
                >
                  {kpi.trendUp ? "\u2191" : "\u2193"} {kpi.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Picker Sheet */}
      <KpiPicker open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  );
}
