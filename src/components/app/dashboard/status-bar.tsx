"use client";

interface StatusSegment {
  label: string;
  value: number;
  color: string;
}

interface StatusBarProps {
  segments: StatusSegment[];
}

export function StatusBar({ segments }: StatusBarProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  return (
    <div className="clean-card overflow-hidden px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[0.625rem] font-medium text-muted-foreground">
          Passport Status
        </p>
        <p className="font-mono text-[0.625rem] text-muted-foreground/70">
          {total} total
        </p>
      </div>

      {/* Segmented bar */}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {segments.map((seg) =>
          seg.value > 0 ? (
            <div
              key={seg.label}
              className="transition-all duration-500"
              style={{
                width: `${(seg.value / total) * 100}%`,
                backgroundColor: seg.color,
              }}
              title={`${seg.label}: ${seg.value}`}
            />
          ) : null,
        )}
      </div>

      {/* Inline legend */}
      <div className="mt-2 flex items-center gap-4">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[0.625rem] text-muted-foreground">
              {seg.label}
            </span>
            <span className="font-mono text-[0.625rem] font-semibold text-foreground">
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
