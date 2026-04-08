"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Passport } from "@/types/passport";

interface SolarPanelDiagramProps {
  passport: Passport;
  publicId: string;
}

const zones = [
  {
    id: "overview",
    label: "A",
    title: "General Info",
    color: "#3b82f6",
    href: "",
  },
  {
    id: "specs",
    label: "B",
    title: "Specifications",
    color: "#22c55e",
    href: "/specs",
  },
  {
    id: "compliance",
    label: "C",
    title: "Compliance",
    color: "#eab308",
    href: "/compliance",
  },
  {
    id: "circularity",
    label: "D",
    title: "Circularity",
    color: "#ef4444",
    href: "/circularity",
  },
  {
    id: "documents",
    label: "E",
    title: "Documents",
    color: "#a855f7",
    href: "/documents",
  },
];

export function SolarPanelDiagram({
  passport,
  publicId,
}: SolarPanelDiagramProps) {
  const router = useRouter();

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          Click any zone to navigate to the corresponding data section
        </p>

        <svg
          viewBox="0 0 800 500"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Panel frame */}
          <rect
            x="40"
            y="40"
            width="720"
            height="420"
            rx="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />

          {/* Frame corners - mounting bolts */}
          {[
            [52, 52],
            [748, 52],
            [52, 448],
            [748, 448],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground/50"
            />
          ))}

          {/* Solar cells grid - 6x10 */}
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={75 + col * 67}
                y={75 + row * 58}
                width="60"
                height="51"
                rx="2"
                fill="currentColor"
                className="text-primary/15"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            ))
          )}

          {/* Cell grid lines (busbars) */}
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <g key={`lines-${row}-${col}`}>
                {/* Horizontal busbars */}
                <line
                  x1={75 + col * 67}
                  y1={91 + row * 58}
                  x2={135 + col * 67}
                  y2={91 + row * 58}
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-primary/30"
                />
                <line
                  x1={75 + col * 67}
                  y1={108 + row * 58}
                  x2={135 + col * 67}
                  y2={108 + row * 58}
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-primary/30"
                />
              </g>
            ))
          )}

          {/* Junction box */}
          <rect
            x="350"
            y="35"
            width="100"
            height="20"
            rx="4"
            fill="currentColor"
            className="text-muted/80"
          />
          <text
            x="400"
            y="49"
            textAnchor="middle"
            fill="currentColor"
            className="text-muted-foreground text-[9px]"
          >
            JUNCTION BOX
          </text>

          {/* Cable lines from junction box */}
          <line
            x1="375"
            y1="35"
            x2="375"
            y2="20"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <line
            x1="425"
            y1="35"
            x2="425"
            y2="20"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <text
            x="375"
            y="14"
            textAnchor="middle"
            fill="#ef4444"
            className="text-[8px] font-bold"
          >
            +
          </text>
          <text
            x="425"
            y="14"
            textAnchor="middle"
            fill="#3b82f6"
            className="text-[8px] font-bold"
          >
            −
          </text>

          {/* Zone A - General Info (top-left) */}
          <motion.g
            className="cursor-pointer"
            onClick={() => router.push(`/passport/${publicId}`)}
            whileHover={{ scale: 1.02 }}
          >
            <rect
              x="55"
              y="65"
              width="190"
              height="85"
              rx="8"
              fill={zones[0].color}
              fillOpacity="0.08"
              stroke={zones[0].color}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="80" cy="88" r="12" fill={zones[0].color} />
            <text
              x="80"
              y="93"
              textAnchor="middle"
              fill="white"
              className="text-[11px] font-bold"
            >
              A
            </text>
            <text
              x="100"
              y="92"
              fill={zones[0].color}
              className="text-[11px] font-semibold"
            >
              General Info
            </text>
            <text
              x="70"
              y="115"
              fill="currentColor"
              className="text-muted-foreground text-[9px]"
            >
              {passport.model_id}
            </text>
            <text
              x="70"
              y="130"
              fill="currentColor"
              className="text-muted-foreground text-[8px]"
            >
              {passport.manufacturer_name}
            </text>
          </motion.g>

          {/* Zone B - Specifications (top-right) */}
          <motion.g
            className="cursor-pointer"
            onClick={() => router.push(`/passport/${publicId}/specs`)}
            whileHover={{ scale: 1.02 }}
          >
            <rect
              x="555"
              y="65"
              width="190"
              height="85"
              rx="8"
              fill={zones[1].color}
              fillOpacity="0.08"
              stroke={zones[1].color}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="580" cy="88" r="12" fill={zones[1].color} />
            <text
              x="580"
              y="93"
              textAnchor="middle"
              fill="white"
              className="text-[11px] font-bold"
            >
              B
            </text>
            <text
              x="600"
              y="92"
              fill={zones[1].color}
              className="text-[11px] font-semibold"
            >
              Specifications
            </text>
            <text
              x="570"
              y="115"
              fill="currentColor"
              className="text-muted-foreground text-[9px]"
            >
              {passport.rated_power_stc_w}W STC
            </text>
            <text
              x="570"
              y="130"
              fill="currentColor"
              className="text-muted-foreground text-[8px]"
            >
              η = {passport.module_efficiency_percent}%
            </text>
          </motion.g>

          {/* Zone C - Compliance (center) */}
          <motion.g
            className="cursor-pointer"
            onClick={() => router.push(`/passport/${publicId}/compliance`)}
            whileHover={{ scale: 1.02 }}
          >
            <rect
              x="280"
              y="175"
              width="240"
              height="85"
              rx="8"
              fill={zones[2].color}
              fillOpacity="0.08"
              stroke={zones[2].color}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="305" cy="198" r="12" fill={zones[2].color} />
            <text
              x="305"
              y="203"
              textAnchor="middle"
              fill="white"
              className="text-[11px] font-bold"
            >
              C
            </text>
            <text
              x="325"
              y="202"
              fill={zones[2].color}
              className="text-[11px] font-semibold"
            >
              Compliance & Certs
            </text>
            {/* Cert badges */}
            {["IEC 61215", "IEC 61730", "CE"].map((cert, i) => (
              <g key={cert}>
                <rect
                  x={295 + i * 72}
                  y="215"
                  width="64"
                  height="20"
                  rx="4"
                  fill={zones[2].color}
                  fillOpacity="0.15"
                />
                <text
                  x={327 + i * 72}
                  y="228"
                  textAnchor="middle"
                  fill={zones[2].color}
                  className="text-[8px] font-medium"
                >
                  {cert}
                </text>
              </g>
            ))}
            <text
              x="400"
              y="252"
              textAnchor="middle"
              fill={zones[2].color}
              className="text-[8px]"
            >
              CERTIFIED
            </text>
          </motion.g>

          {/* Zone D - Circularity (bottom-left) */}
          <motion.g
            className="cursor-pointer"
            onClick={() =>
              router.push(`/passport/${publicId}/circularity`)
            }
            whileHover={{ scale: 1.02 }}
          >
            <rect
              x="55"
              y="310"
              width="230"
              height="130"
              rx="8"
              fill={zones[3].color}
              fillOpacity="0.08"
              stroke={zones[3].color}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="80" cy="333" r="12" fill={zones[3].color} />
            <text
              x="80"
              y="338"
              textAnchor="middle"
              fill="white"
              className="text-[11px] font-bold"
            >
              D
            </text>
            <text
              x="100"
              y="337"
              fill={zones[3].color}
              className="text-[11px] font-semibold"
            >
              Circularity
            </text>
            {/* Recyclability gauge */}
            <text
              x="70"
              y="370"
              fill="currentColor"
              className="text-muted-foreground text-[8px]"
            >
              RECYCLABILITY
            </text>
            <rect
              x="70"
              y="377"
              width="140"
              height="8"
              rx="4"
              fill="currentColor"
              className="text-muted/30"
            />
            <rect
              x="70"
              y="377"
              width="129"
              height="8"
              rx="4"
              fill={zones[3].color}
              fillOpacity="0.6"
            />
            <text
              x="220"
              y="385"
              fill={zones[3].color}
              className="text-[9px] font-bold"
            >
              92%
            </text>
            {/* Material recovery icons */}
            {["Al", "Si", "Cu", "Ag", "Glass"].map((mat, i) => (
              <g key={mat}>
                <rect
                  x={70 + i * 38}
                  y="400"
                  width="32"
                  height="20"
                  rx="4"
                  fill={zones[3].color}
                  fillOpacity="0.12"
                />
                <text
                  x={86 + i * 38}
                  y="414"
                  textAnchor="middle"
                  fill={zones[3].color}
                  className="text-[8px] font-medium"
                >
                  {mat}
                </text>
              </g>
            ))}
          </motion.g>

          {/* Zone E - Documents (bottom-right) */}
          <motion.g
            className="cursor-pointer"
            onClick={() =>
              router.push(`/passport/${publicId}/documents`)
            }
            whileHover={{ scale: 1.02 }}
          >
            <rect
              x="525"
              y="310"
              width="220"
              height="130"
              rx="8"
              fill={zones[4].color}
              fillOpacity="0.08"
              stroke={zones[4].color}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="550" cy="333" r="12" fill={zones[4].color} />
            <text
              x="550"
              y="338"
              textAnchor="middle"
              fill="white"
              className="text-[11px] font-bold"
            >
              E
            </text>
            <text
              x="570"
              y="337"
              fill={zones[4].color}
              className="text-[11px] font-semibold"
            >
              Documents
            </text>
            {/* Document list */}
            {["Datasheet", "DoC", "Manual", "EPD"].map((doc, i) => (
              <g key={doc}>
                <rect
                  x="540"
                  y={358 + i * 20}
                  width="12"
                  height="14"
                  rx="2"
                  fill={zones[4].color}
                  fillOpacity="0.2"
                />
                <text
                  x="560"
                  y={369 + i * 20}
                  fill="currentColor"
                  className="text-muted-foreground text-[9px]"
                >
                  {doc}
                </text>
              </g>
            ))}
          </motion.g>

          {/* Center badge - Passport ID */}
          <rect
            x="290"
            y="430"
            width="220"
            height="24"
            rx="12"
            fill="currentColor"
            className="text-primary/10"
          />
          <text
            x="400"
            y="446"
            textAnchor="middle"
            fill="currentColor"
            className="text-primary text-[9px] font-mono"
          >
            {passport.pv_passport_id}
          </text>

          {/* Carbon footprint badge */}
          <rect
            x="310"
            y="280"
            width="180"
            height="22"
            rx="11"
            fill="currentColor"
            className="text-emerald-500/10"
          />
          <text
            x="400"
            y="295"
            textAnchor="middle"
            fill="currentColor"
            className="text-emerald-400 text-[9px]"
          >
            CO₂: {passport.carbon_footprint_kg_co2e} kg/module
          </text>
        </svg>

        {/* Section navigation pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {zones.map((zone) => (
            <motion.button
              key={zone.id}
              onClick={() =>
                router.push(`/passport/${publicId}${zone.href}`)
              }
              className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-xs transition-colors hover:bg-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: zone.color }}
              >
                {zone.label}
              </span>
              <span className="text-muted-foreground">{zone.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
