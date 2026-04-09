"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FLEET_PR_DATA = [
  { month: "Nov", pr: 83.1 },
  { month: "Dec", pr: 81.8 },
  { month: "Jan", pr: 80.2 },
  { month: "Feb", pr: 82.4 },
  { month: "Mar", pr: 81.9 },
  { month: "Apr", pr: 81.4 },
];

export function FleetPRWidget() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = useMemo(
    () => Math.max(...FLEET_PR_DATA.map((d) => d.pr)),
    [],
  );
  const min = useMemo(
    () => Math.min(...FLEET_PR_DATA.map((d) => d.pr)),
    [],
  );
  const range = max - min || 1;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#0D0D0D]">
            Fleet Performance Ratio
          </h2>
          <p className="text-xs text-[#737373]">Last 6 months trend</p>
        </div>
        <div className="border border-[#D9D9D9] px-2 py-1">
          <span className="font-mono text-sm font-bold text-[#0D0D0D]">
            81.4%
          </span>
        </div>
      </div>

      <div
        className="relative mt-4 h-28"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute -top-7 z-10 border border-[#D9D9D9] bg-white px-2 py-0.5 text-xs shadow-sm"
              style={{
                left: `${(hoveredIndex / (FLEET_PR_DATA.length - 1)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              <span className="font-mono font-semibold">
                {FLEET_PR_DATA[hoveredIndex].pr}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-full w-full items-end justify-between gap-2">
          {FLEET_PR_DATA.map((d, i) => {
            const barHeight = `${((d.pr - min + 2) / (range + 4)) * 100}%`;
            const isHovered = hoveredIndex === i;
            const isAdjacent =
              hoveredIndex !== null && Math.abs(hoveredIndex - i) === 1;

            return (
              <div
                key={d.month}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <div
                  className="flex h-full w-full items-end"
                  onMouseEnter={() => setHoveredIndex(i)}
                >
                  <motion.div
                    className="w-full"
                    style={{ height: barHeight }}
                    initial={false}
                    animate={{
                      backgroundColor: isHovered
                        ? "#22C55E"
                        : isAdjacent
                          ? "rgba(34,197,94,0.3)"
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
    </div>
  );
}
