"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MaterialSegment {
  name: string;
  massPercent: number;
  massG?: number;
  color: string;
  isCritical?: boolean;
  isSoC?: boolean;
  description?: string;
}

interface MaterialDonutProps {
  materials: MaterialSegment[];
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/* Monochrome palette — green accent for primary, grays for rest.
   Colors passed via props take precedence. */
const FALLBACK_COLORS = [
  "#22C55E", "#0D0D0D", "#404040", "#737373",
  "#A3A3A3", "#D9D9D9", "#0D0D0D", "#404040", "#737373",
];

export function MaterialDonut({
  materials,
  size = 240,
  strokeWidth = 28,
  className,
}: MaterialDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const totalMass = useMemo(
    () => materials.reduce((sum, m) => sum + (m.massG ?? 0), 0),
    [materials]
  );

  // Build segments with cumulative offsets
  const segments = useMemo(() => {
    let cumulative = 0;
    return materials.map((m, i) => {
      const pct = m.massPercent / 100;
      const gapDeg = 1.5; // gap between segments in degrees
      const gapPct = gapDeg / 360;
      const segPct = Math.max(pct - gapPct, 0.005);
      const offset = cumulative;
      cumulative += pct;
      return {
        ...m,
        color: m.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        segPct,
        offset,
        index: i,
      };
    });
  }, [materials]);

  const active = activeIndex !== null ? segments[activeIndex] : null;

  return (
    <div className={cn("flex flex-col lg:flex-row items-center gap-6 lg:gap-8", className)}>
      {/* Donut chart */}
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#F2F2F2"
            strokeWidth={strokeWidth}
          />

          {/* Material segments */}
          {segments.map((seg, i) => {
            const isActive = activeIndex === i;
            const dashLen = seg.segPct * circumference;
            const dashOffset = -seg.offset * circumference;

            return (
              <motion.circle
                key={seg.name}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isActive ? strokeWidth + 6 : strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dashLen} ${circumference}`}
                strokeDashoffset={dashOffset}
                initial={{ opacity: 0, strokeDasharray: `0 ${circumference}` }}
                animate={{
                  opacity: 1,
                  strokeDasharray: `${dashLen} ${circumference}`,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.06,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  cursor: "pointer",
                  transition: "stroke-width 0.2s ease",
                }}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(isActive ? null : i)}
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center text-center px-4"
              >
                <span className="text-3xl font-bold tabular-nums text-[#0D0D0D]">
                  {active.massPercent}%
                </span>
                <span className="text-xs font-medium text-[#737373] mt-0.5 max-w-[120px] truncate">
                  {active.name}
                </span>
                {active.massG != null && (
                  <span className="text-[10px] text-[#737373] font-mono mt-0.5">
                    {active.massG >= 1000
                      ? `${(active.massG / 1000).toFixed(1)} kg`
                      : `${active.massG} g`}
                  </span>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="total"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center"
              >
                <span className="text-2xl font-bold text-[#0D0D0D] tabular-nums">
                  {totalMass >= 1000
                    ? `${(totalMass / 1000).toFixed(1)}`
                    : totalMass}
                </span>
                <span className="text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                  {totalMass >= 1000 ? "kg total" : "g total"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-1.5">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.name}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.04 }}
            className={cn(
              "flex items-center justify-between px-3 py-2 transition-all duration-200 cursor-pointer",
              activeIndex === i
                ? "bg-[#F2F2F2] border border-[#D9D9D9]"
                : "hover:bg-[#F2F2F2]"
            )}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-sm text-[#0D0D0D]">{seg.name}</span>
              {seg.isCritical && (
                <span className="bg-[#FEF3C7] border border-[#D9D9D9] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#0D0D0D]">
                  CRM
                </span>
              )}
              {seg.isSoC && (
                <span className="bg-[#FEE2E2] border border-[#D9D9D9] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#0D0D0D]">
                  SoC
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {seg.massG != null && (
                <span className="text-xs text-[#737373] font-mono">
                  {seg.massG >= 1000
                    ? `${(seg.massG / 1000).toFixed(1)}kg`
                    : `${seg.massG}g`}
                </span>
              )}
              <span className="font-mono text-sm font-bold tabular-nums text-[#0D0D0D]">
                {seg.massPercent}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
