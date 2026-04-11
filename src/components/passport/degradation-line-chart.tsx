"use client";

import { useMemo, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface DegradationLineChartProps {
  degradationPercentPerYear: number;
  expectedLifetimeYears: number;
  performanceWarrantyYears: number;
  performanceWarrantyPercent: number;
  ratedPowerW: number;
  className?: string;
}

const CHART_W = 560;
const CHART_H = 280;
const PAD = { top: 24, right: 20, bottom: 40, left: 52 };
const INNER_W = CHART_W - PAD.left - PAD.right;
const INNER_H = CHART_H - PAD.top - PAD.bottom;

export function DegradationLineChart({
  degradationPercentPerYear,
  expectedLifetimeYears,
  performanceWarrantyYears,
  performanceWarrantyPercent,
  ratedPowerW,
  className,
}: DegradationLineChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  // Generate data points: year 0 → expectedLifetimeYears
  const points = useMemo(() => {
    const pts: { year: number; power: number; percent: number }[] = [];
    for (let y = 0; y <= expectedLifetimeYears; y++) {
      // First year often has higher degradation (~2%), subsequent years linear
      const firstYearDeg = Math.min(degradationPercentPerYear * 2.5, 3);
      const pct =
        y === 0
          ? 100
          : 100 - firstYearDeg - degradationPercentPerYear * (y - 1);
      const clampedPct = Math.max(pct, 0);
      pts.push({
        year: y,
        power: Math.round((ratedPowerW * clampedPct) / 100),
        percent: Math.round(clampedPct * 10) / 10,
      });
    }
    return pts;
  }, [degradationPercentPerYear, expectedLifetimeYears, ratedPowerW]);

  // Scale helpers
  const xScale = (year: number) => PAD.left + (year / expectedLifetimeYears) * INNER_W;
  const minPct = Math.max(points[points.length - 1].percent - 5, 50);
  const yScale = (pct: number) =>
    PAD.top + ((100 - pct) / (100 - minPct)) * INNER_H;

  // Build SVG path for the degradation curve
  const linePath = useMemo(() => {
    return points
      .map((p, i) => {
        const x = xScale(p.year);
        const y = yScale(p.percent);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [points]);

  // Area under the curve
  const areaPath = useMemo(() => {
    const bottomY = yScale(minPct);
    const start = `M ${xScale(0)} ${bottomY}`;
    const curvePart = points
      .map((p) => `L ${xScale(p.year)} ${yScale(p.percent)}`)
      .join(" ");
    const end = `L ${xScale(expectedLifetimeYears)} ${bottomY} Z`;
    return `${start} ${curvePart} ${end}`;
  }, [points, minPct]);

  // Warranty threshold line
  const warrantyY = yScale(performanceWarrantyPercent);
  const warrantyX = xScale(performanceWarrantyYears);

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = 10;
    for (let v = Math.ceil(minPct / step) * step; v <= 100; v += step) {
      ticks.push(v);
    }
    return ticks;
  }, [minPct]);

  // X-axis ticks (every 5 years)
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = expectedLifetimeYears <= 15 ? 3 : 5;
    for (let v = 0; v <= expectedLifetimeYears; v += step) {
      ticks.push(v);
    }
    if (ticks[ticks.length - 1] !== expectedLifetimeYears) {
      ticks.push(expectedLifetimeYears);
    }
    return ticks;
  }, [expectedLifetimeYears]);

  // Hover point
  const hoverPoint = hoverYear !== null ? points[hoverYear] : null;

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        onMouseLeave={() => setHoverYear(null)}
      >
        {/* Grid lines */}
        {yTicks.map((v) => (
          <line
            key={`grid-y-${v}`}
            x1={PAD.left}
            y1={yScale(v)}
            x2={CHART_W - PAD.right}
            y2={yScale(v)}
            stroke="var(--border)"
            strokeWidth={0.5}
          />
        ))}

        {/* Warranty threshold zone (below warranty %) */}
        <rect
          x={PAD.left}
          y={warrantyY}
          width={INNER_W}
          height={yScale(minPct) - warrantyY}
          fill="#22C55E"
          fillOpacity={0.04}
        />

        {/* Warranty dashed line */}
        <motion.line
          x1={PAD.left}
          y1={warrantyY}
          x2={warrantyX}
          y2={warrantyY}
          stroke="#22C55E"
          strokeWidth={1}
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 0.8 }}
        />

        {/* Warranty vertical marker */}
        <motion.line
          x1={warrantyX}
          y1={PAD.top}
          x2={warrantyX}
          y2={yScale(minPct)}
          stroke="#22C55E"
          strokeWidth={1}
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : {}}
          transition={{ delay: 0.8 }}
        />

        {/* Warranty label */}
        <motion.text
          x={warrantyX + 4}
          y={warrantyY - 6}
          className="text-[9px] fill-[#22C55E] font-medium"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          {performanceWarrantyPercent}% @ {performanceWarrantyYears}yr warranty
        </motion.text>

        {/* Area fill under curve */}
        <motion.path
          d={areaPath}
          fill="url(#degradation-gradient)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Degradation curve */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Start & end dots */}
        {inView && (
          <>
            <motion.circle
              cx={xScale(0)}
              cy={yScale(100)}
              r={3.5}
              fill="var(--foreground)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            />
            <motion.circle
              cx={xScale(expectedLifetimeYears)}
              cy={yScale(points[points.length - 1].percent)}
              r={3.5}
              fill="var(--muted-foreground)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
            />
          </>
        )}

        {/* Hover interaction zones */}
        {points.map((p) => (
          <rect
            key={`hover-${p.year}`}
            x={xScale(p.year) - INNER_W / expectedLifetimeYears / 2}
            y={PAD.top}
            width={INNER_W / expectedLifetimeYears}
            height={INNER_H}
            fill="transparent"
            onMouseEnter={() => setHoverYear(p.year)}
          />
        ))}

        {/* Hover crosshair + tooltip */}
        {hoverPoint && (
          <>
            <line
              x1={xScale(hoverPoint.year)}
              y1={PAD.top}
              x2={xScale(hoverPoint.year)}
              y2={yScale(minPct)}
              stroke="var(--foreground)"
              strokeWidth={0.5}
              strokeDasharray="3 2"
              opacity={0.4}
            />
            <circle
              cx={xScale(hoverPoint.year)}
              cy={yScale(hoverPoint.percent)}
              r={4}
              fill="var(--foreground)"
              stroke="var(--card)"
              strokeWidth={2}
            />
            {/* Tooltip */}
            <g
              transform={`translate(${Math.min(xScale(hoverPoint.year), CHART_W - PAD.right - 80)}, ${yScale(hoverPoint.percent) - 44})`}
            >
              <rect
                x={-36}
                y={0}
                width={72}
                height={36}
                rx={4}
                fill="var(--foreground)"
                fillOpacity={0.92}
              />
              <text
                x={0}
                y={14}
                textAnchor="middle"
                className="text-[9px] fill-white font-medium"
              >
                Year {hoverPoint.year}
              </text>
              <text
                x={0}
                y={28}
                textAnchor="middle"
                className="text-[10px] fill-white font-bold font-mono"
              >
                {hoverPoint.power}W ({hoverPoint.percent}%)
              </text>
            </g>
          </>
        )}

        {/* Y-axis labels */}
        {yTicks.map((v) => (
          <text
            key={`y-label-${v}`}
            x={PAD.left - 8}
            y={yScale(v) + 3}
            textAnchor="end"
            className="text-[9px] fill-[var(--muted-foreground)] font-mono"
          >
            {v}%
          </text>
        ))}

        {/* X-axis labels */}
        {xTicks.map((v) => (
          <text
            key={`x-label-${v}`}
            x={xScale(v)}
            y={CHART_H - PAD.bottom + 16}
            textAnchor="middle"
            className="text-[9px] fill-[var(--muted-foreground)] font-mono"
          >
            {v}yr
          </text>
        ))}

        {/* Axis labels */}
        <text
          x={CHART_W / 2}
          y={CHART_H - 4}
          textAnchor="middle"
          className="text-[10px] fill-[var(--muted-foreground)] font-medium"
        >
          Module Lifetime
        </text>

        {/* Gradient definition */}
        <defs>
          <linearGradient
            id="degradation-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.08} />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
      </svg>

      {/* Summary stats below chart */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 bg-foreground rounded-full" />
          <span className="text-muted-foreground">Projected output</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 border-b border-dashed border-primary" />
          <span className="text-muted-foreground">Warranty threshold</span>
        </div>
        <span className="text-muted-foreground">
          Degradation: <span className="font-mono font-bold text-foreground">{degradationPercentPerYear}%/yr</span>
        </span>
        <span className="text-muted-foreground">
          End of life: <span className="font-mono font-bold text-foreground">{points[points.length - 1].percent}%</span>
        </span>
      </div>
    </div>
  );
}
