"use client";

import { useId } from "react";

interface AreaChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  targetValue?: number;
  xLabels?: string[];
  yMin?: number;
  yMax?: number;
  showDots?: boolean;
}

const PAD = { top: 12, right: 16, bottom: 24, left: 44 };

export function AreaChart({
  data,
  width = 480,
  height = 200,
  color = "#22C55E",
  targetValue,
  xLabels,
  yMin: yMinProp,
  yMax: yMaxProp,
  showDots = true,
}: AreaChartProps) {
  const uid = useId().replace(/:/g, "");
  if (data.length < 2) return null;

  const rawMin = Math.min(...data);
  const rawMax = Math.max(...data);
  const yMin = yMinProp ?? rawMin - (rawMax - rawMin) * 0.15;
  const yMax = yMaxProp ?? rawMax + (rawMax - rawMin) * 0.15;
  const yRange = yMax - yMin || 1;

  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * plotW;
  const toY = (v: number) => PAD.top + plotH - ((v - yMin) / yRange) * plotH;

  const coords = data.map((v, i) => ({ x: toX(i), y: toY(v) }));
  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPoints = [
    ...coords.map((c) => `${c.x},${c.y}`),
    `${coords[coords.length - 1].x},${PAD.top + plotH}`,
    `${coords[0].x},${PAD.top + plotH}`,
  ].join(" ");

  const gradId = `area-grad-${uid}`;
  const lastPt = coords[coords.length - 1];

  // Grid lines (4 horizontal)
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const val = yMin + (yRange / gridCount) * i;
    return { y: toY(val), label: val.toFixed(1) };
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
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            y1={g.y}
            x2={width - PAD.right}
            y2={g.y}
            stroke="#F2F2F2"
            strokeWidth={1}
          />
          <text
            x={PAD.left - 6}
            y={g.y + 3}
            textAnchor="end"
            fill="#A3A3A3"
            fontSize={9}
            fontFamily="JetBrains Mono, monospace"
          >
            {g.label}
          </text>
        </g>
      ))}

      {/* Target line */}
      {targetValue != null && (
        <g>
          <line
            x1={PAD.left}
            y1={toY(targetValue)}
            x2={width - PAD.right}
            y2={toY(targetValue)}
            stroke="#A3A3A3"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <text
            x={width - PAD.right + 4}
            y={toY(targetValue) + 3}
            fill="#A3A3A3"
            fontSize={8}
            fontFamily="JetBrains Mono, monospace"
          >
            {targetValue}%
          </text>
        </g>
      )}

      {/* Area fill */}
      <polygon points={areaPoints} fill={`url(#${gradId})`} />

      {/* Line */}
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data dots */}
      {showDots &&
        coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={i === coords.length - 1 ? 3 : 2}
            fill={color}
            opacity={i === coords.length - 1 ? 1 : 0.6}
          />
        ))}

      {/* Pulse on last dot */}
      {showDots && (
        <circle cx={lastPt.x} cy={lastPt.y} r={3} fill={color}>
          <animate
            attributeName="r"
            values="2.5;4;2.5"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* X-axis labels */}
      {xLabels &&
        xLabels.map((label, i) => {
          const x = PAD.left + (i / (xLabels.length - 1)) * plotW;
          return (
            <text
              key={i}
              x={x}
              y={height - 4}
              textAnchor="middle"
              fill="#A3A3A3"
              fontSize={9}
              fontFamily="JetBrains Mono, monospace"
            >
              {label}
            </text>
          );
        })}
    </svg>
  );
}
