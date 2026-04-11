"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface CarbonComparisonChartProps {
  carbonFootprintKgCo2e: number;
  moduleTechnology: string;
  className?: string;
}

/* Industry averages for carbon footprint by module technology (kg CO2e/module).
   Sources: IEA-PVPS Task 12, Fraunhofer ISE 2024 data.
   These are per-module averages for a ~400W residential panel. */
const INDUSTRY_BENCHMARKS: Record<
  string,
  { label: string; avgCarbon: number; bestInClass: number }
> = {
  crystalline_silicon_topcon: {
    label: "TOPCon Si",
    avgCarbon: 450,
    bestInClass: 320,
  },
  crystalline_silicon_perc: {
    label: "PERC Si",
    avgCarbon: 500,
    bestInClass: 380,
  },
  crystalline_silicon_hjt: {
    label: "HJT Si",
    avgCarbon: 430,
    bestInClass: 310,
  },
  thin_film_cdte: {
    label: "CdTe Thin Film",
    avgCarbon: 280,
    bestInClass: 200,
  },
  thin_film_cigs: {
    label: "CIGS Thin Film",
    avgCarbon: 320,
    bestInClass: 230,
  },
  other: {
    label: "All Technologies",
    avgCarbon: 460,
    bestInClass: 300,
  },
};

const BAR_MAX_W = 380;
const BAR_H = 32;
const CHART_PAD_LEFT = 130;

export function CarbonComparisonChart({
  carbonFootprintKgCo2e,
  moduleTechnology,
  className,
}: CarbonComparisonChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hoverBar, setHoverBar] = useState<string | null>(null);

  const benchmark =
    INDUSTRY_BENCHMARKS[moduleTechnology] ?? INDUSTRY_BENCHMARKS.other;

  const bars = [
    {
      key: "product",
      label: "This Module",
      value: carbonFootprintKgCo2e,
      color: "#0D0D0D",
      bold: true,
    },
    {
      key: "best",
      label: "Best in Class",
      value: benchmark.bestInClass,
      color: "#22C55E",
      bold: false,
    },
    {
      key: "average",
      label: `${benchmark.label} Avg`,
      value: benchmark.avgCarbon,
      color: "#A3A3A3",
      bold: false,
    },
  ];

  const maxValue = Math.max(...bars.map((b) => b.value)) * 1.15;

  const getWidth = (value: number) => (value / maxValue) * BAR_MAX_W;

  // Determine if this product beats the average
  const vsBenchmark = carbonFootprintKgCo2e - benchmark.avgCarbon;
  const vsBenchmarkPct = Math.round((vsBenchmark / benchmark.avgCarbon) * 100);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${CHART_PAD_LEFT + BAR_MAX_W + 80} ${bars.length * (BAR_H + 20) + 16}`}
        className="w-full h-auto"
      >
        {bars.map((bar, i) => {
          const y = i * (BAR_H + 20) + 8;
          const barW = getWidth(bar.value);
          const isHover = hoverBar === bar.key;

          return (
            <g
              key={bar.key}
              onMouseEnter={() => setHoverBar(bar.key)}
              onMouseLeave={() => setHoverBar(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Label */}
              <text
                x={CHART_PAD_LEFT - 10}
                y={y + BAR_H / 2 + 4}
                textAnchor="end"
                className={cn(
                  "text-[11px]",
                  bar.bold
                    ? "fill-[var(--foreground)] font-semibold"
                    : "fill-[var(--muted-foreground)] font-medium"
                )}
              >
                {bar.label}
              </text>

              {/* Bar background */}
              <rect
                x={CHART_PAD_LEFT}
                y={y}
                width={BAR_MAX_W}
                height={BAR_H}
                rx={4}
                fill="var(--muted)"
              />

              {/* Bar fill */}
              <motion.rect
                x={CHART_PAD_LEFT}
                y={y}
                height={BAR_H}
                rx={4}
                fill={bar.color}
                fillOpacity={isHover ? 1 : 0.85}
                initial={{ width: 0 }}
                animate={inView ? { width: barW } : { width: 0 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />

              {/* Value label */}
              <motion.text
                x={CHART_PAD_LEFT + barW + 8}
                y={y + BAR_H / 2 + 4}
                className="text-[11px] fill-[var(--foreground)] font-mono font-bold"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                {bar.value} kg
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Comparison summary */}
      <motion.div
        className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]"
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1 }}
      >
        <span className="text-muted-foreground">
          vs. industry average:{" "}
          <span
            className={cn(
              "font-mono font-bold",
              vsBenchmark <= 0 ? "text-primary" : "text-foreground"
            )}
          >
            {vsBenchmark <= 0 ? "" : "+"}
            {vsBenchmarkPct}%
          </span>
        </span>
        {vsBenchmark <= 0 && (
          <span className="text-primary font-medium">
            Below average carbon footprint
          </span>
        )}
        <span className="text-muted-foreground/70">
          Unit: kg CO&#8322;e per module
        </span>
      </motion.div>
    </div>
  );
}
