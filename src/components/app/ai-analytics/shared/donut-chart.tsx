"use client";

interface DonutChartSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutChartSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  showLegend?: boolean;
}

export function DonutChart({
  segments,
  size = 160,
  strokeWidth = 18,
  centerLabel,
  centerValue,
  showLegend = true,
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = 3; // px gap between segments

  let cumulativeOffset = 0;

  const arcs = segments.map((seg) => {
    const fraction = seg.value / total;
    const dashLength = Math.max(fraction * circumference - gap, 0);
    const dashGap = circumference - dashLength;
    const offset = -cumulativeOffset;
    cumulativeOffset += fraction * circumference;

    return {
      ...seg,
      dashLength,
      dashGap,
      offset,
      percent: Math.round(fraction * 100),
    };
  });

  const legendHeight = showLegend ? segments.length * 22 + 8 : 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />

        {/* Segments */}
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.dashLength} ${arc.dashGap}`}
            strokeDashoffset={arc.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
            className="transition-all duration-700"
          />
        ))}

        {/* Center text */}
        {centerValue && (
          <text
            x={cx}
            y={centerLabel ? cy - 4 : cy + 4}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--foreground)"
            fontSize={22}
            fontWeight={700}
            fontFamily="JetBrains Mono, monospace"
          >
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            fontSize={9}
            fontFamily="DM Sans, sans-serif"
          >
            {centerLabel}
          </text>
        )}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {arcs.map((arc, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 shrink-0"
                style={{ backgroundColor: arc.color }}
              />
              <span className="text-[10px] text-muted-foreground">{arc.label}</span>
              <span className="font-mono text-[10px] font-semibold text-foreground">
                {arc.percent}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
