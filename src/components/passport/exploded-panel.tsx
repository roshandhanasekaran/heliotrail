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

const defaultLayers: MaterialLayer[] = [
  { name: "Tempered Glass", massPercent: 42, massG: 12000, color: "#60a5fa", description: "Front protective layer — fully recyclable via glass cullet recovery" },
  { name: "EVA Encapsulant", massPercent: 4, massG: 1100, color: "#a78bfa", description: "Adhesive layer — thermal delamination required before recovery" },
  { name: "Silicon Cells", massPercent: 2, massG: 480, color: "#34d399", description: "Photovoltaic cells — recoverable via chemical etching process" },
  { name: "Copper Interconnects", massPercent: 1, massG: 350, color: "#f97316", description: "Cell wiring — recoverable via copper smelting" },
  { name: "Backsheet Polymer", massPercent: 2, massG: 650, color: "#f472b6", description: "Rear protection — energy recovery or specialized recycling" },
  { name: "Aluminium Frame", massPercent: 11, massG: 3200, color: "#fbbf24", description: "Structural frame — fully recyclable via aluminium smelting" },
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
          className="group flex items-center gap-2 border border-border bg-muted px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all hover:border-primary/30 hover:bg-primary/10"
        >
          <motion.span
            animate={{ rotate: isExploded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-primary"
          >
            {isExploded ? "↑" : "↓"}
          </motion.span>
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            {isExploded ? "Collapse Layers" : "Explode Panel View"}
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
        {/* 3D Isometric panel */}
        <div className="flex-1 w-full max-w-lg">
          <svg
            viewBox="0 0 500 420"
            className="w-full"
            onMouseLeave={() => setActiveLayer(null)}
          >
            <defs>
              <filter id="layer-glow-v2">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Isometric grid pattern */}
              <pattern id="iso-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(76,175,80,0.06)" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(76,175,80,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect x="0" y="0" width="500" height="420" fill="url(#iso-grid)" rx="8" />

            {layers.map((layer, i) => {
              const layerH = 32;
              const gap = isExploded ? 18 : 0;
              const totalH = layers.length * layerH + (layers.length - 1) * gap;
              const startY = (420 - totalH) / 2;
              const y = startY + i * (layerH + gap);

              // Isometric offset for 3D look
              const isoX = 12;
              const isoY = 6;
              const isActive = activeLayer === i;
              const w = 340;
              const x = (500 - w) / 2;

              return (
                <motion.g
                  key={layer.name}
                  animate={{
                    y: isExploded ? 0 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 22,
                    delay: isExploded ? i * 0.06 : (layers.length - i) * 0.04,
                  }}
                  onMouseEnter={() => setActiveLayer(i)}
                  className="cursor-pointer"
                >
                  {/* Side face (3D depth) */}
                  <motion.polygon
                    points={`${x + w},${y} ${x + w + isoX},${y - isoY} ${x + w + isoX},${y - isoY + layerH} ${x + w},${y + layerH}`}
                    fill={layer.color}
                    fillOpacity={isActive ? 0.25 : 0.1}
                    stroke={layer.color}
                    strokeWidth={isActive ? 1 : 0.5}
                    strokeOpacity={isActive ? 0.6 : 0.2}
                  />

                  {/* Top face (3D depth) */}
                  <motion.polygon
                    points={`${x},${y} ${x + isoX},${y - isoY} ${x + w + isoX},${y - isoY} ${x + w},${y}`}
                    fill={layer.color}
                    fillOpacity={isActive ? 0.3 : 0.12}
                    stroke={layer.color}
                    strokeWidth={isActive ? 1 : 0.5}
                    strokeOpacity={isActive ? 0.6 : 0.2}
                  />

                  {/* Front face */}
                  <motion.rect
                    x={x}
                    y={y}
                    width={w}
                    height={layerH}
                    rx="3"
                    fill={layer.color}
                    fillOpacity={isActive ? 0.3 : 0.1}
                    stroke={layer.color}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    strokeOpacity={isActive ? 0.8 : 0.25}
                    filter={isActive ? "url(#layer-glow-v2)" : undefined}
                    animate={{ fillOpacity: isActive ? 0.3 : 0.1 }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Material pattern lines inside front face */}
                  {isExploded && (
                    <>
                      <line
                        x1={x + 8}
                        y1={y + layerH / 3}
                        x2={x + w - 8}
                        y2={y + layerH / 3}
                        stroke={layer.color}
                        strokeWidth="0.3"
                        strokeOpacity="0.3"
                        strokeDasharray="4 6"
                      />
                      <line
                        x1={x + 8}
                        y1={y + (layerH * 2) / 3}
                        x2={x + w - 8}
                        y2={y + (layerH * 2) / 3}
                        stroke={layer.color}
                        strokeWidth="0.3"
                        strokeOpacity="0.3"
                        strokeDasharray="4 6"
                      />
                    </>
                  )}

                  {/* Layer label */}
                  <text
                    x={x + 16}
                    y={y + layerH / 2 + 1}
                    fill={layer.color}
                    className="text-[11px] font-semibold"
                    dominantBaseline="middle"
                    opacity={isActive || isExploded ? 1 : 0.7}
                  >
                    {layer.name}
                  </text>

                  {/* Mass percent */}
                  <text
                    x={x + w - 16}
                    y={y + layerH / 2 + 1}
                    fill={layer.color}
                    className="text-[11px] font-mono font-bold"
                    dominantBaseline="middle"
                    textAnchor="end"
                    opacity={isActive || isExploded ? 1 : 0.5}
                  >
                    {layer.massPercent}%
                  </text>

                  {/* Mass in grams - show on explode */}
                  {isExploded && layer.massG && (
                    <text
                      x={x + w - 60}
                      y={y + layerH / 2 + 1}
                      fill={layer.color}
                      className="text-[9px] font-mono"
                      dominantBaseline="middle"
                      textAnchor="end"
                      opacity={0.5}
                    >
                      {(layer.massG / 1000).toFixed(1)}kg
                    </text>
                  )}

                  {/* Connector line to side label when exploded */}
                  {isExploded && isActive && (
                    <>
                      <line
                        x1={x + w + isoX + 4}
                        y1={y + layerH / 2 - isoY}
                        x2={x + w + isoX + 20}
                        y2={y + layerH / 2 - isoY}
                        stroke={layer.color}
                        strokeWidth="1"
                        strokeOpacity="0.5"
                      />
                      <circle
                        cx={x + w + isoX + 4}
                        cy={y + layerH / 2 - isoY}
                        r="2"
                        fill={layer.color}
                        fillOpacity="0.6"
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
                {/* Outer frame */}
                <rect
                  x="76"
                  y={((420 - layers.length * 32) / 2) - 4}
                  width="348"
                  height={layers.length * 32 + 8}
                  rx="6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/10"
                />
                {/* Corner bolts */}
                {[
                  [82, ((420 - layers.length * 32) / 2) + 2],
                  [418, ((420 - layers.length * 32) / 2) + 2],
                  [82, ((420 - layers.length * 32) / 2) + layers.length * 32 + 2],
                  [418, ((420 - layers.length * 32) / 2) + layers.length * 32 + 2],
                ].map(([cx, cy], idx) => (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    className="text-white/15"
                  />
                ))}
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
                className="border border-border bg-card p-4"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="h-4 w-4"
                    style={{
                      backgroundColor: layers[activeLayer].color,
                      boxShadow: `0 0 10px ${layers[activeLayer].color}40`,
                    }}
                  />
                  <span className="text-sm font-bold">
                    {layers[activeLayer].name}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground/60">Mass %</span>
                    <span
                      className="font-mono font-bold"
                      style={{ color: layers[activeLayer].color }}
                    >
                      {layers[activeLayer].massPercent}%
                    </span>
                  </div>
                  {layers[activeLayer].massG && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground/60">Mass</span>
                      <span className="font-mono">
                        {(layers[activeLayer].massG / 1000).toFixed(1)} kg
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  {layers[activeLayer].description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-border bg-card p-4 text-center"
              >
                <p className="text-xs text-muted-foreground/40">
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
