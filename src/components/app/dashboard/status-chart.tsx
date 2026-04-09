"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StatusChartProps {
  data: { name: string; value: number; color: string }[];
}

export function StatusChart({ data }: StatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={90}
          tick={{ fontSize: 12, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
        />
        <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
