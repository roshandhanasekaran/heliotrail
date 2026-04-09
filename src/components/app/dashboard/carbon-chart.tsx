"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CarbonChartProps {
  data: { model: string; co2: number }[];
}

export function CarbonChart({ data }: CarbonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
        <XAxis
          dataKey="model"
          tick={{ fontSize: 11, fill: "#737373" }}
          axisLine={{ stroke: "#D9D9D9" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
          width={50}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #D9D9D9",
            fontSize: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
          formatter={(value) => [`${value} kg CO₂e`, "Carbon Footprint"]}
        />
        <Bar dataKey="co2" fill="#22C55E" radius={[2, 2, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
