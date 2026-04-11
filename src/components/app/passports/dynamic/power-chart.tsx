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
  Line,
} from "recharts";
import { CHART_TOOLTIP_STYLE } from "@/lib/mock/dynamic-data";
import type { PowerDataPoint } from "@/lib/mock/dynamic-data";

interface PowerChartProps {
  data: PowerDataPoint[];
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
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          width={45}
          tickFormatter={(v) => `${v}W`}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          cursor={{ fill: "rgba(34,197,94,0.06)" }}
          formatter={(value, name) => [
            `${value} W`,
            name === "expected" ? "Expected" : "Avg Power",
          ]}
        />
        <ReferenceLine
          y={555}
          stroke="#A3A3A3"
          strokeDasharray="8 4"
          label={{
            value: "Rated: 555W",
            position: "insideTopRight",
            fontSize: 9,
            fill: "#A3A3A3",
          }}
        />
        {/* Expected output (faint) */}
        <Line
          type="natural"
          dataKey="expected"
          stroke="#A3A3A3"
          strokeWidth={1}
          strokeDasharray="4 4"
          dot={false}
        />
        {/* Actual output */}
        <Area
          type="natural"
          dataKey="power"
          stroke="#22C55E"
          strokeWidth={2}
          fill="url(#powerGradient)"
          activeDot={{ r: 3, fill: "#22C55E" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
