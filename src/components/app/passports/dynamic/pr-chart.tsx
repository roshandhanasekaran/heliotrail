"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { CHART_TOOLTIP_STYLE } from "@/lib/mock/dynamic-data";
import type { PRDataPoint } from "@/lib/mock/dynamic-data";

interface PRChartProps {
  data: PRDataPoint[];
}

export function PRChart({ data }: PRChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="prExpectedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="prActualGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#22C55E" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={{ stroke: "#D9D9D9" }}
          tickLine={false}
        />
        <YAxis
          domain={[70, 90]}
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value, name) => [
            `${Number(value).toFixed(1)}%`,
            name === "expected" ? "Expected PR" : "Actual PR",
          ]}
        />
        <ReferenceLine
          y={80}
          stroke="#F59E0B"
          strokeDasharray="6 4"
          label={{
            value: "Min threshold: 80%",
            position: "insideTopRight",
            fontSize: 9,
            fill: "#F59E0B",
          }}
        />
        <Area
          type="natural"
          dataKey="expected"
          stroke="#22C55E"
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="url(#prExpectedGradient)"
        />
        <Area
          type="natural"
          dataKey="actual"
          stroke="#22C55E"
          strokeWidth={2}
          fill="url(#prActualGradient)"
          dot={{ r: 2, fill: "#22C55E", stroke: "#22C55E" }}
          activeDot={{ r: 4, fill: "#22C55E" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
