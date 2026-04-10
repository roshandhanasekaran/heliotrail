"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { AreaChart } from "@/components/app/ai-analytics/shared/area-chart";
import { DualLineChart } from "@/components/app/ai-analytics/shared/dual-line-chart";
import { BarChart } from "@/components/app/ai-analytics/shared/bar-chart";
import {
  getFleetBenchmarking,
  getPerformanceForecast,
  type FleetBenchmark,
} from "@/lib/mock/ai-analytics";

const benchmarks = getFleetBenchmarking();
const forecast = getPerformanceForecast();

type SortKey = "rank" | "pr";

export function PerformanceDetail() {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...benchmarks].sort((a, b) => {
    const mul = sortAsc ? 1 : -1;
    if (sortKey === "rank") return (a.rank - b.rank) * mul;
    return (a.pr - b.pr) * mul;
  });

  const statusCounts = {
    outperforming: benchmarks.filter((b) => b.status === "outperforming").length,
    normal: benchmarks.filter((b) => b.status === "normal").length,
    underperforming: benchmarks.filter((b) => b.status === "underperforming").length,
  };

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "rank");
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#0D0D0D] uppercase tracking-wider">
          Performance Intelligence
        </h1>
        <p className="text-xs text-[#737373] mt-1">
          Fleet-wide performance ratio analysis with 30-day forecasting.
        </p>
      </div>

      {/* Fleet PR Hero + Sparkline */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-6 flex items-center gap-8 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#737373]">
            Fleet PR (Current)
          </p>
          <p className="font-mono text-4xl font-bold text-[#0D0D0D] mt-1">
            81.4<span className="text-lg text-[#737373]">%</span>
          </p>
          <p className="text-[10px] text-[#737373] mt-1">
            Target: {forecast.prTarget}%
          </p>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-[10px] uppercase tracking-wider text-[#737373] mb-2">
            30-Day Forecast
          </p>
          <AreaChart
            data={forecast.pr30dForecast}
            height={160}
            color="#22C55E"
            targetValue={forecast.prTarget}
            xLabels={forecast.pr30dForecast.map((_, i) => i === 0 ? "Today" : i === forecast.pr30dForecast.length - 1 ? "Day 30" : "")}
            showDots={true}
          />
        </div>
      </div>

      {/* PR Trend Description */}
      <div className="border border-dashed border-[#D9D9D9] bg-[#F2F2F2] p-4">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-1">
          Seasonal Outlook
        </p>
        <p className="text-xs text-[#0D0D0D] leading-relaxed">
          {forecast.seasonalOutlook}
        </p>
      </div>

      {/* 25-Year Degradation Trajectory */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          25-Year Degradation Trajectory
        </p>
        <DualLineChart
          data={forecast.degradationTrajectory.map((d) => ({
            x: d.year,
            line1: d.actual,
            line2: d.warranty,
          }))}
          line1Color="#22C55E"
          line2Color="#F59E0B"
          line1Label="Actual"
          line2Label="Warranty Min"
          yMin={80}
          yMax={102}
        />
      </div>

      {/* Module Status Distribution */}
      <div className="border border-dashed border-[#D9D9D9] bg-white p-5">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Module Status Distribution
        </p>
        <BarChart
          bars={[
            { label: "Outperforming", value: statusCounts.outperforming, color: "#22C55E" },
            { label: "Normal", value: statusCounts.normal, color: "#737373" },
            { label: "Underperforming", value: statusCounts.underperforming, color: "#EF4444" },
          ]}
          maxValue={benchmarks.length}
          showValues={true}
          barHeight={24}
        />
      </div>

      {/* Full Fleet Benchmarking Table */}
      <div>
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
          Fleet Benchmarking ({benchmarks.length} modules)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[#D9D9D9] text-xs">
            <thead>
              <tr className="bg-[#F2F2F2]">
                <SortableHeader
                  label="Rank"
                  sortKey="rank"
                  activeSortKey={sortKey}
                  sortAsc={sortAsc}
                  onSort={handleSort}
                />
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Module ID
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Model
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Manufacturer
                </th>
                <SortableHeader
                  label="PR%"
                  sortKey="pr"
                  activeSortKey={sortKey}
                  sortAsc={sortAsc}
                  onSort={handleSort}
                />
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Delta
                </th>
                <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m, i) => (
                <tr
                  key={m.moduleId}
                  className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
                >
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {m.rank}
                  </td>
                  <td className="px-3 py-2 font-mono text-[#0D0D0D]">
                    {m.moduleId}
                  </td>
                  <td className="px-3 py-2 text-[#0D0D0D]">{m.modelId}</td>
                  <td className="px-3 py-2 text-[#737373]">
                    {m.manufacturer}
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold text-[#0D0D0D]">
                    {m.pr}%
                  </td>
                  <td
                    className="px-3 py-2 font-mono font-semibold"
                    style={{
                      color:
                        m.delta > 0
                          ? "#22C55E"
                          : m.delta < 0
                            ? "#EF4444"
                            : "#737373",
                    }}
                  >
                    {m.delta > 0 ? "+" : ""}
                    {m.delta}%
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function SortableHeader({
  label,
  sortKey,
  activeSortKey,
  sortAsc,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeSortKey === sortKey;
  return (
    <th className="text-left px-3 py-2">
      <button
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-[#737373] hover:text-[#0D0D0D] transition-colors"
      >
        {label}
        <ArrowUpDown
          className={`h-2.5 w-2.5 ${isActive ? "text-[#22C55E]" : "text-[#A3A3A3]"}`}
        />
        {isActive && (
          <span className="text-[8px] text-[#A3A3A3]">
            {sortAsc ? "asc" : "desc"}
          </span>
        )}
      </button>
    </th>
  );
}

function StatusBadge({
  status,
}: {
  status: FleetBenchmark["status"];
}) {
  const styles: Record<
    FleetBenchmark["status"],
    { bg: string; text: string }
  > = {
    outperforming: { bg: "#DCFCE7", text: "#166534" },
    normal: { bg: "#F3F4F6", text: "#6B7280" },
    underperforming: { bg: "#FEE2E2", text: "#B91C1C" },
  };
  const s = styles[status];
  return (
    <span
      className="px-1.5 py-0.5 text-[8px] font-bold uppercase"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}
