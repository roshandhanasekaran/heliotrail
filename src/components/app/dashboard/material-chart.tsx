"use client";

interface MaterialSegment {
  name: string;
  percent: number;
  color: string;
}

interface MaterialChartProps {
  segments: MaterialSegment[];
}

export function MaterialChart({ segments }: MaterialChartProps) {
  return (
    <div>
      {/* Proportional strip */}
      <div className="flex h-5 w-full overflow-hidden">
        {segments.map((seg) => (
          <div
            key={seg.name}
            className="group relative transition-opacity hover:opacity-80"
            style={{
              width: `${seg.percent}%`,
              backgroundColor: seg.color,
            }}
            title={`${seg.name}: ${seg.percent.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2">
        {segments.map((seg) => (
          <div key={seg.name} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground">{seg.name}</span>
              <span className="ml-1 font-mono text-xs font-semibold text-foreground">
                {seg.percent.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
