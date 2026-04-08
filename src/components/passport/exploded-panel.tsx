"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MaterialLayer {
  name: string;
  massPercent: number;
  color: string;
  description: string;
}

interface ExplodedPanelProps {
  materials: MaterialLayer[];
  className?: string;
}

const defaultLayers: MaterialLayer[] = [
  { name: "Tempered Glass", massPercent: 42, color: "#60a5fa", description: "Front protective layer — fully recyclable" },
  { name: "EVA Encapsulant", massPercent: 4, color: "#a78bfa", description: "Adhesive layer — thermal delamination required" },
  { name: "Silicon Cells", massPercent: 2, color: "#34d399", description: "Photovoltaic cells — recoverable via etching" },
  { name: "Backsheet", massPercent: 2, color: "#f472b6", description: "Rear protection — energy recovery" },
  { name: "Aluminium Frame", massPercent: 11, color: "#fbbf24", description: "Structural frame — fully recyclable via smelting" },
];

export function ExplodedPanel({
  materials = defaultLayers,
  className,
}: ExplodedPanelProps) {
  const [isExploded, setIsExploded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = materials.length > 0 ? materials : defaultLayers;

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-col items-center gap-2 mb-4">
        <button
          onClick={() => setIsExploded(!isExploded)}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {isExploded ? "Collapse Layers" : "Explode Panel Layers →"}
        </button>
      </div>

      <div className="flex items-center justify-center gap-8 lg:gap-16">
        {/* SVG Panel Cross-Section */}
        <svg
          viewBox="0 0 400 350"
          className="w-full max-w-md"
          onMouseLeave={() => setActiveLayer(null)}
        >
          <defs>
            <filter id="layer-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {layers.map((layer, i) => {
            const baseY = 100;
            const layerHeight = 30;
            const normalY = baseY + i * layerHeight;
            const explodedY = baseY + i * (layerHeight + 28);
            const isActive = activeLayer === i;

            return (
              <motion.g
                key={layer.name}
                animate={{
                  y: isExploded ? explodedY - normalY : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: isExploded ? i * 0.06 : (layers.length - i) * 0.04,
                }}
                onMouseEnter={() => setActiveLayer(i)}
                className="cursor-pointer"
              >
                {/* Layer rect */}
                <motion.rect
                  x="60"
                  y={normalY}
                  width="280"
                  height={layerHeight - 2}
                  rx="4"
                  fill={layer.color}
                  fillOpacity={isActive ? 0.35 : 0.15}
                  stroke={layer.color}
                  strokeWidth={isActive ? 2 : 1}
                  strokeOpacity={isActive ? 0.8 : 0.3}
                  filter={isActive ? "url(#layer-glow)" : undefined}
                  animate={{ fillOpacity: isActive ? 0.35 : 0.15 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Layer label */}
                <text
                  x="75"
                  y={normalY + layerHeight / 2 + 1}
                  fill={layer.color}
                  className="text-[11px] font-medium"
                  dominantBaseline="middle"
                  opacity={isActive || isExploded ? 1 : 0.6}
                >
                  {layer.name}
                </text>

                {/* Mass percent */}
                <text
                  x="325"
                  y={normalY + layerHeight / 2 + 1}
                  fill={layer.color}
                  className="text-[10px] font-mono"
                  dominantBaseline="middle"
                  textAnchor="end"
                  opacity={isActive || isExploded ? 1 : 0.5}
                >
                  {layer.massPercent}%
                </text>
              </motion.g>
            );
          })}

          {/* Panel outline when collapsed */}
          {!isExploded && (
            <rect
              x="58"
              y="98"
              width="284"
              height={layers.length * 30}
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-border/40"
            />
          )}
        </svg>
      </div>

      {/* Active layer detail */}
      <AnimatePresence>
        {activeLayer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 mx-auto max-w-md rounded-lg border border-border/30 bg-card/50 px-4 py-3 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: layers[activeLayer].color }}
              />
              <span className="text-sm font-medium">
                {layers[activeLayer].name}
              </span>
              <span
                className="ml-auto font-mono text-sm"
                style={{ color: layers[activeLayer].color }}
              >
                {layers[activeLayer].massPercent}%
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {layers[activeLayer].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
