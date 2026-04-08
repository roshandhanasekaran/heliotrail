"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Passport } from "@/types/passport";
import {
  LayoutDashboardIcon,
  CpuIcon,
  ShieldCheckIcon,
  RecycleIcon,
  FileTextIcon,
  ArrowRightIcon,
  SunIcon,
} from "lucide-react";

interface SolarPanelDiagramProps {
  passport: Passport;
  publicId: string;
}

const zones = [
  {
    id: "overview",
    label: "A",
    title: "General Info",
    description: "Manufacturer, identity, warranty",
    color: "#6366f1",
    icon: LayoutDashboardIcon,
    href: "",
  },
  {
    id: "specs",
    label: "B",
    title: "Specifications",
    description: "Electrical & mechanical parameters",
    color: "#22c55e",
    icon: CpuIcon,
    href: "/specs",
  },
  {
    id: "compliance",
    label: "C",
    title: "Compliance",
    description: "Certifications & standards",
    color: "#f59e0b",
    icon: ShieldCheckIcon,
    href: "/compliance",
  },
  {
    id: "circularity",
    label: "D",
    title: "Circularity",
    description: "Recyclability & end-of-life",
    color: "#ef4444",
    icon: RecycleIcon,
    href: "/circularity",
  },
  {
    id: "documents",
    label: "E",
    title: "Documents",
    description: "Datasheets, declarations, manuals",
    color: "#8b5cf6",
    icon: FileTextIcon,
    href: "/documents",
  },
];

export function SolarPanelDiagram({
  passport,
  publicId,
}: SolarPanelDiagramProps) {
  const router = useRouter();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left: Interactive panel SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-sm shrink-0"
        >
          <svg
            viewBox="0 0 320 420"
            className="w-full drop-shadow-xl"
          >
            <defs>
              <linearGradient id="panel-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="cell-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <filter id="panel-shadow">
                <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="rgba(0,0,0,0.12)" />
              </filter>
            </defs>

            {/* Panel body */}
            <rect
              x="20" y="30" width="280" height="370" rx="12"
              fill="url(#panel-grad)"
              filter="url(#panel-shadow)"
            />

            {/* Frame highlight */}
            <rect
              x="20" y="30" width="280" height="370" rx="12"
              fill="none"
              stroke="rgba(148,163,184,0.15)"
              strokeWidth="2"
            />

            {/* Solar cells grid */}
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={34 + col * 52}
                  y={44 + row * 43}
                  width="46"
                  height="37"
                  rx="3"
                  fill="url(#cell-grad)"
                  stroke="rgba(99,102,241,0.08)"
                  strokeWidth="0.5"
                />
              ))
            )}

            {/* Busbars */}
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <g key={`bus-${row}-${col}`}>
                  <line
                    x1={34 + col * 52} y1={56 + row * 43}
                    x2={80 + col * 52} y2={56 + row * 43}
                    stroke="rgba(148,163,184,0.12)" strokeWidth="0.4"
                  />
                  <line
                    x1={34 + col * 52} y1={68 + row * 43}
                    x2={80 + col * 52} y2={68 + row * 43}
                    stroke="rgba(148,163,184,0.12)" strokeWidth="0.4"
                  />
                </g>
              ))
            )}

            {/* Junction box */}
            <rect x="130" y="18" width="60" height="16" rx="6" fill="#1e293b" stroke="rgba(148,163,184,0.2)" strokeWidth="0.5" />
            <text x="160" y="29" textAnchor="middle" fill="rgba(148,163,184,0.5)" className="text-[6px] font-medium">J-BOX</text>

            {/* Cables */}
            <line x1="148" y1="18" x2="148" y2="8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="172" y1="18" x2="172" y2="8" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
            <text x="148" y="5" textAnchor="middle" fill="#ef4444" className="text-[7px] font-bold">+</text>
            <text x="172" y="5" textAnchor="middle" fill="#3b82f6" className="text-[7px] font-bold">{"\u2212"}</text>

            {/* Mounting holes */}
            {[
              [30, 40], [290, 40], [30, 390], [290, 390],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
            ))}

            {/* Hover glow */}
            {hoveredZone && (
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                x="20" y="30" width="280" height="370" rx="12"
                fill={zones.find((z) => z.id === hoveredZone)?.color ?? "#6366f1"}
                fillOpacity="0.06"
              />
            )}

            {/* Model label */}
            <text x="160" y="412" textAnchor="middle" fill="rgba(148,163,184,0.35)" className="text-[8px] font-mono">
              {passport.model_id}
            </text>
          </svg>

          {/* Floating specs badge */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full bg-card border border-border/50 shadow-sm px-4 py-1.5">
              <SunIcon className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {passport.rated_power_stc_w}W
              </span>
              <span className="text-xs text-muted-foreground/40">|</span>
              <span className="text-xs text-muted-foreground">
                {"\u03b7"} {passport.module_efficiency_percent}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: Navigation zone cards */}
        <div className="flex-1 w-full">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm font-medium text-muted-foreground"
          >
            Explore Passport Sections
          </motion.p>
          <div className="grid gap-2.5">
            {zones.map((zone, i) => {
              const Icon = zone.icon;
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                >
                  <button
                    onClick={() => router.push(`/passport/${publicId}${zone.href}`)}
                    className="group w-full text-left"
                  >
                    <div
                      className="relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-all duration-300 hover:shadow-lg"
                      style={{
                        boxShadow: hoveredZone === zone.id
                          ? `0 4px 20px ${zone.color}15, 0 0 0 1px ${zone.color}20`
                          : undefined,
                        borderColor: hoveredZone === zone.id
                          ? `${zone.color}30`
                          : undefined,
                      }}
                    >
                      {/* Top accent line on hover */}
                      <div
                        className="absolute top-0 left-3 right-3 h-0.5 rounded-full transition-opacity duration-300"
                        style={{
                          backgroundColor: zone.color,
                          opacity: hoveredZone === zone.id ? 0.7 : 0,
                        }}
                      />
                      <div className="relative flex items-center gap-4">
                        {/* Zone icon */}
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110"
                          style={{
                            backgroundColor: `${zone.color}12`,
                            boxShadow: hoveredZone === zone.id
                              ? `0 4px 12px ${zone.color}20`
                              : "none",
                          }}
                        >
                          <Icon className="h-5 w-5" style={{ color: zone.color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-bold rounded px-1.5 py-0.5"
                              style={{
                                backgroundColor: `${zone.color}15`,
                                color: zone.color,
                              }}
                            >
                              {zone.label}
                            </span>
                            <span className="text-sm font-semibold">
                              {zone.title}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {zone.description}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ArrowRightIcon
                          className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-muted-foreground"
                        />
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Passport ID */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 flex items-center gap-3"
          >
            <div className="h-px flex-1 bg-border/50" />
            <span className="font-mono text-[11px] text-muted-foreground/50">
              {passport.pv_passport_id}
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </motion.div>

          {/* Carbon badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-3 flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                CO{"\u2082"} Footprint: {passport.carbon_footprint_kg_co2e} kg/module
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
