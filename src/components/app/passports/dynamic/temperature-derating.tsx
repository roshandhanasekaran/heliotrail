"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import { CHART_TOOLTIP_STYLE } from "@/lib/mock/dynamic-data";
import type { TemperaturePoint } from "@/lib/mock/dynamic-data";

interface TemperatureDeratingChartProps {
  data: TemperaturePoint[];
}

export function TemperatureDeratingChart({
  data,
}: TemperatureDeratingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
        <XAxis
          dataKey="temperature"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={{ stroke: "#D9D9D9" }}
          tickLine={false}
          label={{
            value: "Module Temp (°C)",
            position: "insideBottom",
            offset: -2,
            fontSize: 10,
            fill: "#A3A3A3",
          }}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
          width={50}
          domain={[300, 520]}
          tickFormatter={(v) => `${v}W`}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value, name) => [
            `${value} W`,
            name === "theoreticalPower"
              ? "Theoretical"
              : "Measured",
          ]}
          labelFormatter={(label) => `${Number(label).toFixed(1)}°C`}
        />
        {/* Highlight high-temp zone where losses exceed theoretical */}
        <ReferenceArea
          x1={45}
          x2={65}
          fill="#EF4444"
          fillOpacity={0.04}
          label={{
            value: "Excess loss zone",
            position: "insideTopRight",
            fontSize: 9,
            fill: "#EF4444",
          }}
        />
        <Line
          type="natural"
          dataKey="theoreticalPower"
          stroke="#A3A3A3"
          strokeWidth={1.5}
          strokeDasharray="6 3"
          dot={false}
          name="theoreticalPower"
        />
        <Line
          type="natural"
          dataKey="measuredPower"
          stroke="#22C55E"
          strokeWidth={2}
          dot={{ r: 2, fill: "#22C55E", stroke: "#22C55E" }}
          activeDot={{ r: 4, fill: "#22C55E" }}
          name="measuredPower"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
