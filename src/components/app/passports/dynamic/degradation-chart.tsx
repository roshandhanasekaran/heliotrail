"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { CHART_TOOLTIP_STYLE } from "@/lib/mock/dynamic-data";
import type { DegradationDataPoint } from "@/lib/mock/dynamic-data";

interface DegradationChartProps {
  data: DegradationDataPoint[];
}

export function DegradationChart({ data }: DegradationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{ left: 0, right: 12, top: 8, bottom: 8 }}
      >
        <defs>
          <linearGradient
            id="confidenceGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#22C55E" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={{ stroke: "#D9D9D9" }}
          tickLine={false}
          label={{
            value: "Year",
            position: "insideBottom",
            offset: -2,
            fontSize: 10,
            fill: "#A3A3A3",
          }}
        />
        <YAxis
          domain={[75, 102]}
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value: number, name: string) => {
            const labels: Record<string, string> = {
              retention: "This Module",
              warrantyMin: "Warranty Min",
              fleetAvg: "Fleet Average",
              upperBound: "Upper Bound",
              lowerBound: "Lower Bound",
            };
            return [`${Number(value).toFixed(1)}%`, labels[name] ?? name];
          }}
          labelFormatter={(label) => `Year ${label}`}
        />
        {/* Year markers */}
        {[1, 5, 10, 15, 20, 25, 30].map((y) => (
          <ReferenceLine
            key={y}
            x={y}
            stroke="#F2F2F2"
            strokeDasharray="2 2"
          />
        ))}
        {/* Confidence interval band */}
        <Area
          type="natural"
          dataKey="upperBound"
          stroke="none"
          fill="url(#confidenceGradient)"
        />
        <Area
          type="natural"
          dataKey="lowerBound"
          stroke="none"
          fill="#ffffff"
        />
        {/* Fleet average */}
        <Line
          type="natural"
          dataKey="fleetAvg"
          stroke="#A3A3A3"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
          name="fleetAvg"
        />
        {/* Warranty minimum */}
        <Line
          type="natural"
          dataKey="warrantyMin"
          stroke="#F59E0B"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          dot={false}
          name="warrantyMin"
        />
        {/* This module */}
        <Line
          type="natural"
          dataKey="retention"
          stroke="#22C55E"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: "#22C55E" }}
          name="retention"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
