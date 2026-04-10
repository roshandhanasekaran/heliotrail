"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { MODULE_TECHNOLOGY_LABELS } from "@/lib/constants";

const TECH_COLORS: Record<string, string> = {
  crystalline_silicon_topcon: "#22C55E",
  crystalline_silicon_perc: "#3B82F6",
  crystalline_silicon_hjt: "#F59E0B",
  thin_film_cdte: "#EF4444",
  thin_film_cigs: "#8B5CF6",
  other: "#737373",
};

interface CarbonDatum {
  model: string;
  co2: number;
  technology?: string;
}

interface CarbonChartProps {
  data: CarbonDatum[];
}

export function CarbonChart({ data }: CarbonChartProps) {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  // Derive which technologies exist in the data
  const availableTechs = useMemo(() => {
    const techs = new Set<string>();
    for (const d of data) {
      techs.add(d.technology ?? "other");
    }
    // Return in a stable order matching MODULE_TECHNOLOGY_LABELS
    return Object.keys(MODULE_TECHNOLOGY_LABELS).filter((t) => techs.has(t));
  }, [data]);

  // Filter data by selected technology
  const filtered = useMemo(() => {
    const subset = activeTech
      ? data.filter((d) => (d.technology ?? "other") === activeTech)
      : data;
    return [...subset].sort((a, b) => a.co2 - b.co2);
  }, [data, activeTech]);

  // Truncate model names for x-axis when many bars
  const chartData = useMemo(() => {
    const maxBars = 15;
    const displayed = filtered.length > maxBars ? filtered.slice(-maxBars) : filtered;
    return displayed.map((d) => ({
      ...d,
      label: d.model.length > 14 ? d.model.substring(0, 12) + "\u2026" : d.model,
    }));
  }, [filtered]);

  return (
    <div>
      {/* Technology filter chips */}
      {availableTechs.length > 1 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTech(null)}
            className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              activeTech === null
                ? "bg-[#0D0D0D] text-white"
                : "bg-[#F2F2F2] text-[#737373] hover:bg-[#E5E5E5]"
            }`}
          >
            All ({data.length})
          </button>
          {availableTechs.map((tech) => {
            const count = data.filter(
              (d) => (d.technology ?? "other") === tech,
            ).length;
            const isActive = activeTech === tech;
            return (
              <button
                key={tech}
                onClick={() => setActiveTech(isActive ? null : tech)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "bg-[#F2F2F2] text-[#737373] hover:bg-[#E5E5E5]"
                }`}
                style={isActive ? { backgroundColor: TECH_COLORS[tech] ?? "#737373" } : undefined}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: TECH_COLORS[tech] ?? "#737373",
                    display: isActive ? "none" : undefined,
                  }}
                />
                {MODULE_TECHNOLOGY_LABELS[tech] ?? tech} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Vertical bar chart */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ left: 0, right: 8, top: 24, bottom: 8 }}
        >
          <defs>
            {Object.entries(TECH_COLORS).map(([key, color]) => (
              <linearGradient
                key={key}
                id={`carbon-grad-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.4} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F2F2F2"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#737373" }}
            axisLine={{ stroke: "#D9D9D9" }}
            tickLine={false}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#737373" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #D9D9D9",
              fontSize: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
            formatter={(value) => [`${value} kg CO₂e`, "Carbon Footprint"]}
            labelFormatter={(label) => {
              const match = chartData.find((d) => d.label === label);
              return match ? match.model : label;
            }}
            cursor={{ fill: "rgba(34,197,94,0.06)" }}
          />
          <Bar
            dataKey="co2"
            radius={[3, 3, 0, 0]}
            maxBarSize={32}
            animationDuration={600}
          >
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.technology
                    ? `url(#carbon-grad-${entry.technology})`
                    : "url(#carbon-grad-other)"
                }
                className="transition-opacity hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Count indicator when filtered */}
      {activeTech && filtered.length > 15 && (
        <p className="mt-1 text-center text-[0.625rem] text-[#A3A3A3]">
          Showing top 15 of {filtered.length} modules
        </p>
      )}
    </div>
  );
}
