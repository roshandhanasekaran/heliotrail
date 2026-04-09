"use client";

import { useId } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({
  data,
  width = 48,
  height = 16,
  color,
}: SparklineProps) {
  const uid = useId().replace(/:/g, "");
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const trending = data[data.length - 1] >= data[0];
  const stroke = color ?? (trending ? "#22C55E" : "#EF4444");
  const gradientId = `spark-grad-${uid}`;

  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 3) - 1.5,
  }));

  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");

  // Closed polygon for the gradient fill area
  const areaPoints = [
    ...coords.map((c) => `${c.x},${c.y}`),
    `${width},${height}`,
    `0,${height}`,
  ].join(" ");

  const lastPoint = coords[coords.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Gradient fill area */}
      <polygon
        points={areaPoints}
        fill={`url(#${gradientId})`}
      />
      {/* Line stroke */}
      <polyline
        points={linePoints}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Animated end dot */}
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r={2}
        fill={stroke}
      >
        <animate
          attributeName="r"
          values="1.5;2.5;1.5"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
