"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { CHART_TOOLTIP_STYLE } from "@/lib/mock/dynamic-data";
import type { IrradiancePoint } from "@/lib/mock/dynamic-data";

interface IrradianceScatterProps {
  data: IrradiancePoint[];
}

const TIME_COLORS = {
  morning: "#86EFAC",
  midday: "#22C55E",
  afternoon: "#F59E0B",
};

export function IrradianceScatter({ data }: IrradianceScatterProps) {
  const morning = data.filter((d) => d.timeOfDay === "morning");
  const midday = data.filter((d) => d.timeOfDay === "midday");
  const afternoon = data.filter((d) => d.timeOfDay === "afternoon");

  // Linear regression reference: power = (irradiance / 1000) * 485
  const refData = [
    { irradiance: 100, power: 48 },
    { irradiance: 1100, power: 534 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ScatterChart margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
        <XAxis
          type="number"
          dataKey="irradiance"
          name="Irradiance"
          unit=" W/m²"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={{ stroke: "#D9D9D9" }}
          tickLine={false}
          domain={[0, 1200]}
          label={{
            value: "Irradiance (W/m²)",
            position: "insideBottom",
            offset: -2,
            fontSize: 10,
            fill: "#A3A3A3",
          }}
        />
        <YAxis
          type="number"
          dataKey="power"
          name="Power"
          unit=" W"
          tick={{ fontSize: 10, fill: "#737373" }}
          axisLine={false}
          tickLine={false}
          width={50}
          domain={[0, 550]}
          label={{
            value: "Power (W)",
            angle: -90,
            position: "insideLeft",
            offset: 10,
            fontSize: 10,
            fill: "#A3A3A3",
          }}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value, name) => [
            `${value}${name === "Irradiance" ? " W/m²" : " W"}`,
            String(name),
          ]}
        />
        {/* Reference line: theoretical output */}
        <ReferenceLine
          segment={refData.map((d) => ({ x: d.irradiance, y: d.power })) as [{ x: number; y: number }, { x: number; y: number }]}
          stroke="#A3A3A3"
          strokeDasharray="6 3"
          strokeWidth={1.5}
        />
        <Scatter name="Morning" data={morning} fill={TIME_COLORS.morning} />
        <Scatter name="Midday" data={midday} fill={TIME_COLORS.midday} />
        <Scatter
          name="Afternoon"
          data={afternoon}
          fill={TIME_COLORS.afternoon}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
