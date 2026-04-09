"use client";

export interface CountdownRingProps {
  days: number;
  max: number;
}

export function CountdownRing({ days, max }: CountdownRingProps) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const progress = Math.min(days / max, 1);
  const offset = circ * progress;
  const color = days <= 3 ? "#DC2626" : days <= 7 ? "#F59E0B" : "#22C55E";

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#F2F2F2" strokeWidth="2.5" />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="butt"
        transform="rotate(-90 18 18)"
      />
      <text
        x="18"
        y="18"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="10"
        fontWeight="700"
        fontFamily="JetBrains Mono, monospace"
      >
        {days}
      </text>
    </svg>
  );
}
