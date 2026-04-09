"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";

interface CarbonChartProps {
  data: { model: string; co2: number }[];
}

export function CarbonChart({ data }: CarbonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 24, bottom: 8 }}>
        <defs>
          <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity={1} />
            <stop offset="100%" stopColor="#22C55E" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#F2F2F2"
          vertical={false}
        />
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
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #D9D9D9",
            fontSize: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
          formatter={(value) => [`${value} kg CO₂e`, "Carbon Footprint"]}
          cursor={{ fill: "rgba(34,197,94,0.06)" }}
        />
        <Bar
          dataKey="co2"
          fill="url(#carbonGradient)"
          radius={[3, 3, 0, 0]}
          barSize={36}
          animationDuration={800}
        >
          <LabelList
            dataKey="co2"
            position="top"
            style={{ fontSize: 11, fontWeight: 600, fill: "#0D0D0D" }}
          />
          {data.map((_, i) => (
            <Cell key={i} className="transition-opacity hover:opacity-80" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
