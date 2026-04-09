"use client";

import { useState } from "react";
import type { AvailabilityDataPoint } from "@/lib/mock/dynamic-data";
import { CheckCircle2 } from "lucide-react";

interface AvailabilityTimelineProps {
  data: AvailabilityDataPoint[];
}

export function AvailabilityTimeline({ data }: AvailabilityTimelineProps) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const avgUptime = data.reduce((s, d) => s + d.uptime, 0) / data.length;
  const totalPlanned = data.reduce((s, d) => s + d.planned, 0);
  const totalUnplanned = data.reduce((s, d) => s + d.unplanned, 0);
  const totalDowntime = totalPlanned + totalUnplanned;

  const mtbf = Math.round(8760 / (totalUnplanned > 0 ? totalUnplanned : 1));
  const mttr = totalUnplanned > 0 ? Math.round((totalUnplanned / 12) * 24) : 0;

  // Find max downtime for scaling bars relative to each other
  const maxDowntime = Math.max(...data.map((d) => d.planned + d.unplanned));

  return (
    <div className="space-y-5">
      {/* Top: Uptime gauge + metrics in a row */}
      <div className="flex items-start gap-6">
        {/* Uptime circle */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#F2F2F2"
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeDasharray={`${avgUptime} ${100 - avgUptime}`}
                strokeLinecap="butt"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-sm font-bold text-[#0D0D0D]">
                {avgUptime.toFixed(1)}%
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A3A3]">
            Uptime
          </span>
        </div>

        {/* Metrics */}
        <div className="grid flex-1 grid-cols-3 gap-4 pt-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A3A3]">
              MTBF
            </p>
            <p className="font-mono text-xl font-bold text-[#0D0D0D]">
              {mtbf.toLocaleString()}
              <span className="ml-0.5 text-xs font-normal text-[#737373]">h</span>
            </p>
            <p className="text-[10px] text-[#A3A3A3]">Mean time between failures</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A3A3]">
              MTTR
            </p>
            <p className="font-mono text-xl font-bold text-[#0D0D0D]">
              {mttr}
              <span className="ml-0.5 text-xs font-normal text-[#737373]">h</span>
            </p>
            <p className="text-[10px] text-[#A3A3A3]">Mean time to repair</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A3A3]">
              Total Downtime
            </p>
            <p className="font-mono text-xl font-bold text-[#0D0D0D]">
              {totalDowntime.toFixed(1)}
              <span className="ml-0.5 text-xs font-normal text-[#737373]">%</span>
            </p>
            <p className="text-[10px] text-[#A3A3A3]">
              {totalPlanned.toFixed(1)}% planned · {totalUnplanned.toFixed(1)}% unplanned
            </p>
          </div>
        </div>
      </div>

      {/* Monthly downtime bars — scaled to show detail */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#A3A3A3]">
          Monthly Downtime Breakdown
        </p>
        <div className="space-y-1" onMouseLeave={() => setHoveredMonth(null)}>
          {data.map((d, i) => {
            const downtime = d.planned + d.unplanned;
            const barWidth = maxDowntime > 0 ? (downtime / maxDowntime) * 100 : 0;
            const plannedRatio = downtime > 0 ? (d.planned / downtime) * 100 : 0;
            const isHovered = hoveredMonth === i;

            return (
              <div
                key={d.month}
                className="group flex items-center gap-2"
                onMouseEnter={() => setHoveredMonth(i)}
              >
                <span className="w-7 text-right font-mono text-[10px] text-[#A3A3A3]">
                  {d.month}
                </span>
                <div className="relative h-5 flex-1">
                  {/* Background track */}
                  <div className="absolute inset-0 bg-[#F2F2F2]" />
                  {/* Stacked bar: planned (blue) + unplanned (red) */}
                  <div
                    className="absolute inset-y-0 left-0 flex transition-all duration-200"
                    style={{ width: `${Math.max(barWidth, 1)}%` }}
                  >
                    <div
                      className="h-full bg-[#3B82F6] transition-opacity"
                      style={{
                        width: `${plannedRatio}%`,
                        opacity: isHovered ? 1 : 0.7,
                      }}
                    />
                    <div
                      className="h-full bg-[#EF4444] transition-opacity"
                      style={{
                        width: `${100 - plannedRatio}%`,
                        opacity: isHovered ? 1 : 0.7,
                      }}
                    />
                  </div>
                  {/* Zero downtime indicator */}
                  {downtime < 0.1 && (
                    <div className="absolute inset-y-0 left-2 flex items-center">
                      <CheckCircle2 className="h-3 w-3 text-[#22C55E]" />
                    </div>
                  )}
                </div>
                {/* Hover detail */}
                <span
                  className={`w-16 text-right font-mono text-[10px] transition-colors ${
                    isHovered ? "text-[#0D0D0D] font-semibold" : "text-[#A3A3A3]"
                  }`}
                >
                  {downtime > 0 ? `${downtime.toFixed(1)}%` : "0%"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-[#737373]">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-[#3B82F6]" /> Planned maintenance
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-[#EF4444]" /> Unplanned downtime
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-2.5 w-2.5 text-[#22C55E]" /> No downtime
        </span>
      </div>
    </div>
  );
}
