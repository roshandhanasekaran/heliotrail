"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { CHART_TOOLTIP_STYLE } from "@/lib/mock/dynamic-data";
import type { EnergyYieldDataPoint } from "@/lib/mock/dynamic-data";

interface EnergyYieldChartProps {
  data: EnergyYieldDataPoint[];
}

export function EnergyYieldChart({ data }: EnergyYieldChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart
        data={data}
        margin={{ left: 0, right: 8, top: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={{ stroke: "#D9D9D9" }}
          tickLine={false}
        />
        <YAxis
          yAxisId="bar"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
          width={45}
          tickFormatter={(v) => `${v}`}
          label={{
            value: "kWh",
            position: "insideTopLeft",
            offset: -5,
            fontSize: 9,
            fill: "#A3A3A3",
          }}
        />
        <YAxis
          yAxisId="line"
          orientation="right"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
          width={50}
          tickFormatter={(v) => `${v}`}
          label={{
            value: "Cumulative",
            position: "insideTopRight",
            offset: -5,
            fontSize: 9,
            fill: "#A3A3A3",
          }}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value, name) => {
            const labels: Record<string, string> = {
              expected: "Expected",
              actual: "Actual",
              cumulativeExpected: "Cumul. Expected",
              cumulativeActual: "Cumul. Actual",
            };
            return [`${Number(value).toLocaleString()} kWh`, labels[String(name)] ?? name];
          }}
        />
        <Legend
          iconSize={8}
          wrapperStyle={{ fontSize: 10, color: "#737373" }}
        />
        <Bar
          yAxisId="bar"
          dataKey="expected"
          name="Expected"
          fill="#D9D9D9"
          barSize={14}
        />
        <Bar
          yAxisId="bar"
          dataKey="actual"
          name="Actual"
          fill="#22C55E"
          barSize={14}
        />
        <Line
          yAxisId="line"
          type="natural"
          dataKey="cumulativeExpected"
          name="Cumul. Expected"
          stroke="#A3A3A3"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
        />
        <Line
          yAxisId="line"
          type="natural"
          dataKey="cumulativeActual"
          name="Cumul. Actual"
          stroke="#22C55E"
          strokeWidth={1.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
