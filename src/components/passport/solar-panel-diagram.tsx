"use client";

import { motion } from "framer-motion";
import type { Passport } from "@/types/passport";
import { SunIcon } from "lucide-react";

interface SolarPanelDiagramProps {
  passport: Passport;
  publicId: string;
}

export function SolarPanelDiagram({
  passport,
}: SolarPanelDiagramProps) {
  return (
    <div className="relative mx-auto max-w-md">
      {/* Panel SVG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <svg
          viewBox="0 0 320 420"
          className="relative w-full"
        >
          <defs>
            {/* Subtle sunlight shimmer gradient */}
            <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="40%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.12" />
              <stop offset="60%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-1 -1; 1 1"
                dur="4s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          {/* Panel body */}
          <rect
            x="20" y="30" width="280" height="370"
            fill="var(--muted)"
            stroke="var(--border)"
            strokeWidth="1"
          />

          {/* Frame outline */}
          <rect
            x="20" y="30" width="280" height="370"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="1"
          />

          {/* Solar cells grid */}
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => {
              const x = 34 + col * 52;
              const y = 44 + row * 43;
              return (
                <g key={`${row}-${col}`}>
                  <rect
                    x={x} y={y}
                    width="46" height="37"
                    fill="var(--border)"
                    stroke="var(--border)"
                    strokeWidth="0.5"
                  />
                  {/* Micro grid lines */}
                  <line
                    x1={x} y1={y + 12}
                    x2={x + 46} y2={y + 12}
                    stroke="var(--border)" strokeWidth="0.2" opacity="0.5"
                  />
                  <line
                    x1={x} y1={y + 25}
                    x2={x + 46} y2={y + 25}
                    stroke="var(--border)" strokeWidth="0.2" opacity="0.5"
                  />
                </g>
              );
            })
          )}

          {/* Busbars */}
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <g key={`bus-${row}-${col}`}>
                <line
                  x1={34 + col * 52} y1={56 + row * 43}
                  x2={80 + col * 52} y2={56 + row * 43}
                  stroke="var(--border)" strokeWidth="0.3"
                />
                <line
                  x1={34 + col * 52} y1={68 + row * 43}
                  x2={80 + col * 52} y2={68 + row * 43}
                  stroke="var(--border)" strokeWidth="0.3"
                />
              </g>
            ))
          )}

          {/* Sunlight shimmer overlay */}
          <rect
            x="20" y="30" width="280" height="370"
            fill="url(#shimmer)"
          />

          {/* Junction box */}
          <rect
            x="126" y="14" width="68" height="20"
            fill="var(--muted)" stroke="var(--border)" strokeWidth="0.8"
          />
          <text
            x="160" y="27" textAnchor="middle"
            fill="var(--muted-foreground)" className="text-[6px] font-medium tracking-wider"
          >
            J-BOX
          </text>

          {/* Cables */}
          <line
            x1="148" y1="14" x2="148" y2="2"
            stroke="#ef4444" strokeWidth="2" strokeLinecap="round"
          />
          <line
            x1="172" y1="14" x2="172" y2="2"
            stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"
          />
          <text x="148" y="-2" textAnchor="middle" fill="#ef4444" className="text-[8px] font-bold">+</text>
          <text x="172" y="-2" textAnchor="middle" fill="#3b82f6" className="text-[8px] font-bold">{"\u2212"}</text>

          {/* Mounting holes */}
          {[
            [30, 40], [290, 40], [30, 390], [290, 390],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="4" fill="none" stroke="var(--border)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="1.5" fill="var(--border)" />
            </g>
          ))}

          {/* Model label */}
          <text
            x="160" y="414" textAnchor="middle"
            fill="var(--muted-foreground)" className="text-[7px] font-mono tracking-widest"
          >
            {passport.model_id}
          </text>
        </svg>

        {/* Floating specs badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 border border-border bg-card px-5 py-2 shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground">
                {passport.rated_power_stc_w}W
              </span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <SunIcon className="h-3.5 w-3.5 text-foreground" />
              <span className="text-xs font-medium text-foreground">
                {"\u03b7"} {passport.module_efficiency_percent}%
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Passport ID */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-5 flex items-center gap-3"
      >
        <div className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] text-muted-foreground tracking-wider">
          {passport.pv_passport_id}
        </span>
        <div className="h-px flex-1 bg-border" />
      </motion.div>

      {/* Carbon badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-3 flex justify-center"
      >
        <div className="flex items-center gap-2 bg-[var(--passport-green-muted)] border border-primary px-4 py-1.5">
          <div className="h-2 w-2 bg-primary" />
          <span className="text-xs font-medium text-foreground">
            CO{"\u2082"} Footprint: {passport.carbon_footprint_kg_co2e} kg/module
          </span>
        </div>
      </motion.div>
    </div>
  );
}
