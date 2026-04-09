"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PowerChartProps {
  data: { day: string; power: number }[];
}

export function PowerChart({ data }: PowerChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={{ stroke: "#D9D9D9" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
          width={45}
          tickFormatter={(v) => `${v}W`}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #D9D9D9",
            fontSize: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
          formatter={(value) => [`${value} W`, "Avg Power"]}
        />
        <Area
          type="monotone"
          dataKey="power"
          stroke="#22C55E"
          strokeWidth={2}
          fill="url(#powerGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
