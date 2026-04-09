"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums text-[#0D0D0D]">
          {centerValue ?? total}
        </span>
        {centerLabel && (
          <span className="text-[0.625rem] text-[#737373]">{centerLabel}</span>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data
          .filter((d) => d.value > 0)
          .map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-xs text-[#737373]">
                {d.name} <strong className="text-[#0D0D0D]">{d.value}</strong>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
