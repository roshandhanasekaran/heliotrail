"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductRadarChartProps {
  metrics: {
    label: string;
    value: number; // 0–100 normalized score
    raw: string; // Display value (e.g. "485W", "22.1%")
  }[];
  size?: number;
  className?: string;
}

const LEVELS = 4;

export function ProductRadarChart({
  metrics,
  size = 280,
  className,
}: ProductRadarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const count = metrics.length;

  // Generate angle for each axis (starting from top, going clockwise)
  const angleStep = (2 * Math.PI) / count;
  const startAngle = -Math.PI / 2; // Start from top

  const getPoint = (index: number, radius: number) => {
    const angle = startAngle + index * angleStep;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Grid rings
  const gridRings = useMemo(() => {
    return Array.from({ length: LEVELS }, (_, level) => {
      const r = ((level + 1) / LEVELS) * maxRadius;
      const points = Array.from({ length: count }, (_, i) => getPoint(i, r));
      return points.map((p) => `${p.x},${p.y}`).join(" ");
    });
  }, [count, maxRadius]);

  // Data polygon
  const dataPolygon = useMemo(() => {
    return metrics
      .map((m, i) => {
        const r = (m.value / 100) * maxRadius;
        const p = getPoint(i, r);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  }, [metrics, maxRadius]);

  // Data points
  const dataPoints = useMemo(() => {
    return metrics.map((m, i) => {
      const r = (m.value / 100) * maxRadius;
      return getPoint(i, r);
    });
  }, [metrics, maxRadius]);

  // Axis endpoints
  const axisEndpoints = useMemo(() => {
    return Array.from({ length: count }, (_, i) => getPoint(i, maxRadius));
  }, [count, maxRadius]);

  // Label positions (slightly beyond the chart)
  const labelPositions = useMemo(() => {
    return Array.from({ length: count }, (_, i) =>
      getPoint(i, maxRadius + 24)
    );
  }, [count, maxRadius]);

  return (
    <div ref={ref} className={cn("w-full flex flex-col items-center", className)}>
      <div
        className="relative"
        style={{ width: size, height: size }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          {/* Grid rings */}
          {gridRings.map((points, level) => (
            <polygon
              key={`ring-${level}`}
              points={points}
              fill="none"
              stroke="var(--border)"
              strokeWidth={level === LEVELS - 1 ? 1 : 0.5}
            />
          ))}

          {/* Axis lines */}
          {axisEndpoints.map((end, i) => (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="var(--border)"
              strokeWidth={0.5}
            />
          ))}

          {/* Data polygon fill */}
          <motion.polygon
            points={dataPolygon}
            fill="var(--foreground)"
            fillOpacity={0.06}
            stroke="var(--foreground)"
            strokeWidth={1.5}
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={
              inView
                ? { opacity: 1, scale: 1 }
                : {}
            }
            style={{ transformOrigin: `${center}px ${center}px` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Data points */}
          {dataPoints.map((p, i) => (
            <motion.circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r={hoverIndex === i ? 5 : 3.5}
              fill={hoverIndex === i ? "var(--primary)" : "var(--foreground)"}
              stroke="var(--card)"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.08 }}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}

          {/* Axis labels */}
          {labelPositions.map((pos, i) => {
            const metric = metrics[i];
            const isHover = hoverIndex === i;
            // Determine text anchor based on position
            const angle = startAngle + i * angleStep;
            const normAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            const anchor =
              normAngle < 0.3 || normAngle > 5.98
                ? "middle"
                : normAngle < Math.PI
                  ? "start"
                  : "end";

            return (
              <g key={`label-${i}`}>
                <text
                  x={pos.x}
                  y={pos.y - 4}
                  textAnchor={anchor}
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isHover ? "fill-[var(--foreground)]" : "fill-[var(--muted-foreground)]"
                  )}
                >
                  {metric.label}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 10}
                  textAnchor={anchor}
                  className={cn(
                    "text-[10px] font-mono font-bold",
                    isHover ? "fill-[var(--foreground)]" : "fill-[var(--muted-foreground)]"
                  )}
                >
                  {metric.raw}
                </text>
              </g>
            );
          })}

          {/* Hover tooltip */}
          {hoverIndex !== null && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <rect
                x={center - 30}
                y={center - 14}
                width={60}
                height={28}
                rx={4}
                fill="var(--foreground)"
                fillOpacity={0.9}
              />
              <text
                x={center}
                y={center + 5}
                textAnchor="middle"
                className="text-[12px] fill-white font-mono font-bold"
              >
                {metrics[hoverIndex].value}/100
              </text>
            </motion.g>
          )}
        </svg>
      </div>
    </div>
  );
}
