"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DegradationChartProps {
  data: { year: number; retention: number }[];
  warrantyPercent: number;
}

export function DegradationChart({
  data,
  warrantyPercent,
}: DegradationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={{ stroke: "#D9D9D9" }}
          tickLine={false}
          label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 10, fill: "#A3A3A3" }}
        />
        <YAxis
          domain={[80, 100]}
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #D9D9D9",
            fontSize: 12,
          }}
          formatter={(value) => [`${Number(value).toFixed(1)}%`, "Power Retention"]}
        />
        <ReferenceLine
          y={warrantyPercent}
          stroke="#F59E0B"
          strokeDasharray="4 4"
          label={{ value: `Warranty: ${warrantyPercent}%`, position: "right", fontSize: 10, fill: "#F59E0B" }}
        />
        <Line
          type="monotone"
          dataKey="retention"
          stroke="#22C55E"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#22C55E" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
