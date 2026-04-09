"use client";

interface ComplianceGaugeProps {
  score: number;
  max?: number;
  label?: string;
  size?: number;
}

export function ComplianceGauge({
  score,
  max = 100,
  label = "Compliance",
  size = 120,
}: ComplianceGaugeProps) {
  const pct = Math.min(score / max, 1);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  const color =
    pct >= 0.9
      ? "#22C55E"
      : pct >= 0.7
        ? "#F59E0B"
        : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#F2F2F2"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-2xl font-bold text-[#0D0D0D]">{score}</span>
        <span className="text-[0.625rem] text-[#737373]">/ {max}</span>
      </div>
      <span className="text-xs font-medium text-[#737373]">{label}</span>
    </div>
  );
}
