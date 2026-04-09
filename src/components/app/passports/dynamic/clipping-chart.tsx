"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ClippingDataPoint } from "@/lib/mock/dynamic-data";

interface ClippingChartProps {
  data: ClippingDataPoint[];
}

export function ClippingChart({ data }: ClippingChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxHours = useMemo(
    () => Math.max(...data.map((d) => d.hours)),
    [data],
  );

  return (
    <div className="space-y-3">
      <div
        className="relative h-40"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute -top-10 z-10 border border-[#D9D9D9] bg-white px-2 py-1 text-xs shadow-sm"
              style={{
                left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-mono font-semibold text-[#0D0D0D]">
                {data[hoveredIndex].hours}h clipped
              </div>
              <div className="text-[#A3A3A3]">
                -{data[hoveredIndex].kwhLost} kWh lost
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-full w-full items-end justify-between gap-1">
          {data.map((d, i) => {
            const barHeight = `${(d.hours / maxHours) * 100}%`;
            const isHovered = hoveredIndex === i;
            const isAdjacent =
              hoveredIndex !== null && Math.abs(hoveredIndex - i) === 1;
            const isHigh = d.hours > 20;

            return (
              <div
                key={d.month}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <div
                  className="group relative flex h-full w-full items-end"
                  onMouseEnter={() => setHoveredIndex(i)}
                >
                  <motion.div
                    className="w-full"
                    style={{ height: barHeight }}
                    initial={false}
                    animate={{
                      backgroundColor: isHovered
                        ? isHigh
                          ? "#EF4444"
                          : "#3B82F6"
                        : isAdjacent
                          ? isHigh
                            ? "rgba(239,68,68,0.3)"
                            : "rgba(59,130,246,0.3)"
                          : "#E5E5E5",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className="mt-1 text-[9px] text-[#A3A3A3]">
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-[#737373]">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-[#3B82F6]" /> Normal
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-[#EF4444]" /> &gt;20h/mo
        </span>
      </div>
    </div>
  );
}
