"use client";

import { useId } from "react";

interface DualLineChartProps {
  data: { x: number; line1: number; line2: number }[];
  width?: number;
  height?: number;
  line1Color?: string;
  line2Color?: string;
  line1Label?: string;
  line2Label?: string;
  xLabel?: string;
  yLabel?: string;
  yMin?: number;
  yMax?: number;
}

const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

export function DualLineChart({
  data,
  width = 480,
  height = 220,
  line1Color = "#22C55E",
  line2Color = "#F59E0B",
  line1Label = "Actual",
  line2Label = "Warranty",
  yMin: yMinProp,
  yMax: yMaxProp,
}: DualLineChartProps) {
  const uid = useId().replace(/:/g, "");
  if (data.length < 2) return null;

  const allVals = data.flatMap((d) => [d.line1, d.line2]);
  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);
  const yMin = yMinProp ?? rawMin - (rawMax - rawMin) * 0.1;
  const yMax = yMaxProp ?? rawMax + (rawMax - rawMin) * 0.1;
  const yRange = yMax - yMin || 1;

  const xMin = data[0].x;
  const xMax = data[data.length - 1].x;
  const xRange = xMax - xMin || 1;

  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;

  const toX = (v: number) => PAD.left + ((v - xMin) / xRange) * plotW;
  const toY = (v: number) => PAD.top + plotH - ((v - yMin) / yRange) * plotH;

  const line1Points = data.map((d) => `${toX(d.x)},${toY(d.line1)}`).join(" ");
  const line2Points = data.map((d) => `${toX(d.x)},${toY(d.line2)}`).join(" ");

  // Area fill under line1
  const areaPoints = [
    ...data.map((d) => `${toX(d.x)},${toY(d.line1)}`),
    `${toX(data[data.length - 1].x)},${PAD.top + plotH}`,
    `${toX(data[0].x)},${PAD.top + plotH}`,
  ].join(" ");

  const gradId = `dual-grad-${uid}`;

  // Grid
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const val = yMin + (yRange / gridCount) * i;
    return { y: toY(val), label: val.toFixed(0) + "%" };
  });

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={line1Color} stopOpacity={0.12} />
          <stop offset="100%" stopColor={line1Color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Grid */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            y1={g.y}
            x2={width - PAD.right}
            y2={g.y}
            stroke="var(--muted)"
            strokeWidth={1}
          />
          <text
            x={PAD.left - 6}
            y={g.y + 3}
            textAnchor="end"
            fill="var(--muted-foreground)"
            fontSize={9}
            fontFamily="JetBrains Mono, monospace"
          >
            {g.label}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {data.map((d) => (
        <text
          key={d.x}
          x={toX(d.x)}
          y={height - 4}
          textAnchor="middle"
          fill="var(--muted-foreground)"
          fontSize={9}
          fontFamily="JetBrains Mono, monospace"
        >
          Yr {d.x}
        </text>
      ))}

      {/* Area fill under line1 */}
      <polygon points={areaPoints} fill={`url(#${gradId})`} />

      {/* Line 2 (warranty - dashed) */}
      <polyline
        points={line2Points}
        fill="none"
        stroke={line2Color}
        strokeWidth={1.5}
        strokeDasharray="6 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Line 1 (actual - solid) */}
      <polyline
        points={line1Points}
        fill="none"
        stroke={line1Color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots on line 1 */}
      {data.map((d, i) => (
        <circle key={`l1-${i}`} cx={toX(d.x)} cy={toY(d.line1)} r={2.5} fill={line1Color} />
      ))}

      {/* Dots on line 2 */}
      {data.map((d, i) => (
        <circle key={`l2-${i}`} cx={toX(d.x)} cy={toY(d.line2)} r={2} fill={line2Color} opacity={0.7} />
      ))}

      {/* Legend */}
      <g transform={`translate(${width - PAD.right - 130}, ${PAD.top})`}>
        <rect x={0} y={0} width={130} height={36} rx={2} fill="var(--card)" fillOpacity={0.85} stroke="var(--muted)" strokeWidth={1} />
        <line x1={8} y1={12} x2={24} y2={12} stroke={line1Color} strokeWidth={2} />
        <circle cx={16} cy={12} r={2.5} fill={line1Color} />
        <text x={30} y={15} fill="var(--muted-foreground)" fontSize={9} fontFamily="DM Sans, sans-serif">
          {line1Label}
        </text>
        <line x1={8} y1={26} x2={24} y2={26} stroke={line2Color} strokeWidth={1.5} strokeDasharray="4 2" />
        <circle cx={16} cy={26} r={2} fill={line2Color} />
        <text x={30} y={29} fill="var(--muted-foreground)" fontSize={9} fontFamily="DM Sans, sans-serif">
          {line2Label}
        </text>
      </g>
    </svg>
  );
}
