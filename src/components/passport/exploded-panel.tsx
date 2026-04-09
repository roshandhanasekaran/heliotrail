"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MaterialLayer {
  name: string;
  massPercent: number;
  massG?: number;
  color: string;
  description: string;
}

interface ExplodedPanelProps {
  materials: MaterialLayer[];
  className?: string;
}

/* Monochrome fill palette for layers */
const layerFills = [
  "#F2F2F2",
  "#E5E5E5",
  "#D9D9D9",
  "#F2F2F2",
  "#E5E5E5",
  "#D9D9D9",
];

const defaultLayers: MaterialLayer[] = [
  { name: "Tempered Glass", massPercent: 42, massG: 12000, color: "#60a5fa", description: "Front protective layer \u2014 fully recyclable via glass cullet recovery" },
  { name: "EVA Encapsulant", massPercent: 4, massG: 1100, color: "#a78bfa", description: "Adhesive layer \u2014 thermal delamination required before recovery" },
  { name: "Silicon Cells", massPercent: 2, massG: 480, color: "#34d399", description: "Photovoltaic cells \u2014 recoverable via chemical etching process" },
  { name: "Copper Interconnects", massPercent: 1, massG: 350, color: "#f97316", description: "Cell wiring \u2014 recoverable via copper smelting" },
  { name: "Backsheet Polymer", massPercent: 2, massG: 650, color: "#f472b6", description: "Rear protection \u2014 energy recovery or specialized recycling" },
  { name: "Aluminium Frame", massPercent: 11, massG: 3200, color: "#fbbf24", description: "Structural frame \u2014 fully recyclable via aluminium smelting" },
];

export function ExplodedPanel({
  materials,
  className,
}: ExplodedPanelProps) {
  const [isExploded, setIsExploded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = materials.length > 0 ? materials : defaultLayers;

  return (
    <div className={cn("relative", className)}>
      {/* Toggle button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsExploded(!isExploded)}
          className="group flex items-center gap-2 border border-[#D9D9D9] bg-white px-5 py-2 text-xs font-medium transition-all hover:bg-[#F2F2F2]"
        >
          <motion.span
            animate={{ rotate: isExploded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-[#0D0D0D]"
          >
            {isExploded ? "\u2191" : "\u2193"}
          </motion.span>
          <span className="text-[#0D0D0D]">
            {isExploded ? "Collapse Layers" : "Explode Panel View"}
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
        {/* Isometric panel */}
        <div className="flex-1 w-full max-w-lg">
          <svg
            viewBox="0 0 500 420"
            className="w-full"
            onMouseLeave={() => setActiveLayer(null)}
          >
            {layers.map((layer, i) => {
              const layerH = 32;
              const gap = isExploded ? 18 : 0;
              const totalH = layers.length * layerH + (layers.length - 1) * gap;
              const startY = (420 - totalH) / 2;
              const y = startY + i * (layerH + gap);

              const isoX = 12;
              const isoY = 6;
              const isActive = activeLayer === i;
              const w = 340;
              const x = (500 - w) / 2;

              const fill = layerFills[i % layerFills.length];
              const strokeColor = isActive ? "#22C55E" : "#D9D9D9";
              const strokeW = isActive ? 2 : 1;

              return (
                <motion.g
                  key={layer.name}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 22,
                    delay: isExploded ? i * 0.06 : (layers.length - i) * 0.04,
                  }}
                  onMouseEnter={() => setActiveLayer(i)}
                  className="cursor-pointer"
                >
                  {/* Side face */}
                  <motion.polygon
                    points={`${x + w},${y} ${x + w + isoX},${y - isoY} ${x + w + isoX},${y - isoY + layerH} ${x + w},${y + layerH}`}
                    fill={fill}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    opacity={isActive ? 1 : 0.7}
                  />

                  {/* Top face */}
                  <motion.polygon
                    points={`${x},${y} ${x + isoX},${y - isoY} ${x + w + isoX},${y - isoY} ${x + w},${y}`}
                    fill={fill}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    opacity={isActive ? 0.9 : 0.6}
                  />

                  {/* Front face */}
                  <motion.rect
                    x={x}
                    y={y}
                    width={w}
                    height={layerH}
                    fill={isActive ? "#FAFAFA" : fill}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    animate={{ fill: isActive ? "#FAFAFA" : fill }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Pattern lines when exploded */}
                  {isExploded && (
                    <>
                      <line
                        x1={x + 8} y1={y + layerH / 3}
                        x2={x + w - 8} y2={y + layerH / 3}
                        stroke="#D9D9D9" strokeWidth="0.3"
                        strokeDasharray="4 6"
                      />
                      <line
                        x1={x + 8} y1={y + (layerH * 2) / 3}
                        x2={x + w - 8} y2={y + (layerH * 2) / 3}
                        stroke="#D9D9D9" strokeWidth="0.3"
                        strokeDasharray="4 6"
                      />
                    </>
                  )}

                  {/* Layer label */}
                  <text
                    x={x + 16}
                    y={y + layerH / 2 + 1}
                    fill={isActive ? "#0D0D0D" : "#737373"}
                    className="text-[11px] font-medium"
                    dominantBaseline="middle"
                  >
                    {layer.name}
                  </text>

                  {/* Mass percent */}
                  <text
                    x={x + w - 16}
                    y={y + layerH / 2 + 1}
                    fill={isActive ? "#0D0D0D" : "#737373"}
                    className="text-[11px] font-mono font-semibold"
                    dominantBaseline="middle"
                    textAnchor="end"
                  >
                    {layer.massPercent}%
                  </text>

                  {/* Mass in kg */}
                  {isExploded && layer.massG && (
                    <text
                      x={x + w - 60}
                      y={y + layerH / 2 + 1}
                      fill="#737373"
                      className="text-[9px] font-mono"
                      dominantBaseline="middle"
                      textAnchor="end"
                      opacity={0.7}
                    >
                      {(layer.massG / 1000).toFixed(1)}kg
                    </text>
                  )}

                  {/* Connector line */}
                  {isExploded && isActive && (
                    <>
                      <line
                        x1={x + w + isoX + 4} y1={y + layerH / 2 - isoY}
                        x2={x + w + isoX + 20} y2={y + layerH / 2 - isoY}
                        stroke="#22C55E" strokeWidth="1"
                      />
                      <circle
                        cx={x + w + isoX + 4} cy={y + layerH / 2 - isoY}
                        r="2" fill="#22C55E"
                      />
                    </>
                  )}
                </motion.g>
              );
            })}

            {/* Panel outline when collapsed */}
            {!isExploded && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <rect
                  x="76"
                  y={((420 - layers.length * 32) / 2) - 4}
                  width="348"
                  height={layers.length * 32 + 8}
                  fill="none"
                  stroke="#D9D9D9"
                  strokeWidth="1"
                />
              </motion.g>
            )}
          </svg>
        </div>

        {/* Layer detail sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <AnimatePresence mode="wait">
            {activeLayer !== null ? (
              <motion.div
                key={activeLayer}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="border border-[#D9D9D9] bg-white p-5"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="h-4 w-4"
                    style={{ backgroundColor: layerFills[activeLayer % layerFills.length], border: "1px solid #D9D9D9" }}
                  />
                  <span className="text-sm font-semibold text-[#0D0D0D]">
                    {layers[activeLayer].name}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#737373]">Mass %</span>
                    <span className="font-mono font-semibold text-[#0D0D0D]">
                      {layers[activeLayer].massPercent}%
                    </span>
                  </div>
                  {layers[activeLayer].massG && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[#737373]">Mass</span>
                      <span className="font-mono text-[#0D0D0D]">
                        {(layers[activeLayer].massG / 1000).toFixed(1)} kg
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#737373] leading-relaxed">
                  {layers[activeLayer].description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-[#D9D9D9] bg-[#FAFAFA] p-5 text-center"
              >
                <p className="text-xs text-[#737373]">
                  Hover over a layer to see details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
