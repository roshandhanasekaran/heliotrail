"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MaterialChartProps {
  data: {
    name: string;
    glass: number;
    aluminium: number;
    silicon: number;
    encapsulant: number;
    copper: number;
    other: number;
  }[];
}

const MATERIAL_COLORS: Record<string, string> = {
  glass: "#22C55E",
  aluminium: "#737373",
  silicon: "#3B82F6",
  encapsulant: "#F59E0B",
  copper: "#EF4444",
  other: "#D9D9D9",
};

export function MaterialChart({ data }: MaterialChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 8, top: 8, bottom: 8 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#737373" }}
          axisLine={{ stroke: "#D9D9D9" }}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={80}
          tick={{ fontSize: 11, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #D9D9D9",
            fontSize: 12,
          }}
          formatter={(value, name) => [
            `${Number(value).toFixed(1)}%`,
            String(name).charAt(0).toUpperCase() + String(name).slice(1),
          ]}
        />
        <Legend
          iconType="square"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "#737373" }}
        />
        {Object.entries(MATERIAL_COLORS).map(([key, color]) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={color}
            radius={key === "other" ? [0, 2, 2, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
