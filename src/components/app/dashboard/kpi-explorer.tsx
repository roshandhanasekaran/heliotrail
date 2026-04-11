"use client";

import { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChevronDown, ChevronUp, BarChart3, ScatterChart as ScatterIcon, TrendingUp } from "lucide-react";
import {
  CONTINUOUS_METRICS,
  COLOR_BY_OPTIONS,
  TECHNOLOGY_COLORS,
  STATUS_COLORS,
  type PassportDataPoint,
  type ColorByOption,
  type ChartType,
} from "@/lib/kpi-explorer-registry";
import { useDashboardPreferences } from "@/hooks/use-dashboard-preferences";

interface KpiExplorerProps {
  data: PassportDataPoint[];
}

export function KpiExplorer({ data }: KpiExplorerProps) {
  const { preferences, updatePreferences } = useDashboardPreferences();
  const explorer = preferences.explorer ?? {
    xMetric: "ratedPower",
    yMetric: "carbonFootprint",
    chartType: "scatter" as ChartType,
    colorBy: "technology" as ColorByOption,
  };

  const [expanded, setExpanded] = useState(false);

  const xMetric = CONTINUOUS_METRICS.find((m) => m.id === explorer.xMetric) ?? CONTINUOUS_METRICS[1];
  const yMetric = CONTINUOUS_METRICS.find((m) => m.id === explorer.yMetric) ?? CONTINUOUS_METRICS[0];

  const update = (patch: Partial<typeof explorer>) => {
    updatePreferences({ explorer: { ...explorer, ...patch } });
  };

  // Filter data points that have values for both axes
  const chartData = useMemo(() => {
    return data
      .map((p) => {
        const x = p[xMetric.id as keyof PassportDataPoint];
        const y = p[yMetric.id as keyof PassportDataPoint];
        if (x == null || y == null || typeof x !== "number" || typeof y !== "number") return null;
        return { ...p, x, y };
      })
      .filter((d): d is NonNullable<typeof d> => d != null);
  }, [data, xMetric.id, yMetric.id]);

  // For bar charts, aggregate by category
  const barData = useMemo(() => {
    if (explorer.chartType !== "bar") return [];
    const colorField = explorer.colorBy === "status" ? "status" : "technology";
    const groups = new Map<string, { sum: number; count: number }>();
    for (const p of chartData) {
      const key = p[colorField] as string;
      const existing = groups.get(key);
      if (existing) {
        existing.sum += p.y;
        existing.count++;
      } else {
        groups.set(key, { sum: p.y, count: 1 });
      }
    }
    return Array.from(groups.entries())
      .map(([name, { sum, count }]) => ({
        name,
        value: Math.round(sum / count),
        color:
          explorer.colorBy === "status"
            ? STATUS_COLORS[name] ?? "#737373"
            : TECHNOLOGY_COLORS[name] ?? "#737373",
      }))
      .sort((a, b) => b.value - a.value);
  }, [chartData, explorer.chartType, explorer.colorBy]);

  // Legend items for scatter
  const legendItems = useMemo(() => {
    if (explorer.colorBy === "none") return [];
    const colors = explorer.colorBy === "status" ? STATUS_COLORS : TECHNOLOGY_COLORS;
    const seen = new Set<string>();
    for (const p of chartData) {
      seen.add(explorer.colorBy === "status" ? p.status : p.technology);
    }
    return Array.from(seen).map((key) => ({
      label: key,
      color: colors[key] ?? "#737373",
    }));
  }, [chartData, explorer.colorBy]);

  const getColor = (point: PassportDataPoint) => {
    if (explorer.colorBy === "technology")
      return TECHNOLOGY_COLORS[point.technology] ?? "#737373";
    if (explorer.colorBy === "status")
      return STATUS_COLORS[point.status] ?? "#737373";
    return "#22C55E";
  };

  if (data.length < 2) return null;

  return (
    <div className="clean-card overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground/70" />
          <span className="text-sm font-bold text-foreground">
            Explore Portfolio
          </span>
          <span className="text-[0.625rem] text-muted-foreground">
            {chartData.length} data points
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-5 pb-5">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 py-3">
            {/* X-axis */}
            <div className="flex items-center gap-1.5">
              <label className="text-[0.625rem] font-medium text-muted-foreground">
                X-Axis
              </label>
              <select
                value={explorer.xMetric}
                onChange={(e) => update({ xMetric: e.target.value })}
                className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground"
              >
                {CONTINUOUS_METRICS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} {m.unit ? `(${m.unit})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Y-axis */}
            <div className="flex items-center gap-1.5">
              <label className="text-[0.625rem] font-medium text-muted-foreground">
                Y-Axis
              </label>
              <select
                value={explorer.yMetric}
                onChange={(e) => update({ yMetric: e.target.value })}
                className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground"
              >
                {CONTINUOUS_METRICS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} {m.unit ? `(${m.unit})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Chart type */}
            <div className="flex items-center gap-0.5 rounded border border-border">
              {([
                { type: "scatter" as const, icon: ScatterIcon },
                { type: "bar" as const, icon: BarChart3 },
              ]).map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => update({ chartType: type })}
                  className={`p-1.5 transition-colors ${
                    explorer.chartType === type
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={type}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            {/* Color-by */}
            <div className="flex items-center gap-1.5">
              <label className="text-[0.625rem] font-medium text-muted-foreground">
                Color
              </label>
              <select
                value={explorer.colorBy}
                onChange={(e) => update({ colorBy: e.target.value as ColorByOption })}
                className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground"
              >
                {COLOR_BY_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              {explorer.chartType === "scatter" ? (
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={xMetric.label}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    label={{
                      value: `${xMetric.label}${xMetric.unit ? ` (${xMetric.unit})` : ""}`,
                      position: "insideBottom",
                      offset: -10,
                      fontSize: 10,
                      fill: "var(--muted-foreground)",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={yMetric.label}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    label={{
                      value: `${yMetric.label}${yMetric.unit ? ` (${yMetric.unit})` : ""}`,
                      angle: -90,
                      position: "insideLeft",
                      offset: 5,
                      fontSize: 10,
                      fill: "var(--muted-foreground)",
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      const p = payload[0].payload as PassportDataPoint & { x: number; y: number };
                      return (
                        <div className="rounded border border-border bg-background px-3 py-2 text-xs shadow-sm">
                          <p className="font-medium text-foreground">{p.modelId}</p>
                          <p className="text-muted-foreground">
                            {xMetric.label}: {p.x} {xMetric.unit}
                          </p>
                          <p className="text-muted-foreground">
                            {yMetric.label}: {p.y} {yMetric.unit}
                          </p>
                          <p className="text-muted-foreground/70">{p.technology} · {p.status}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={chartData} isAnimationActive={false}>
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={getColor(entry)}
                        fillOpacity={0.7}
                        r={5}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              ) : (
                <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    label={{
                      value: `Avg ${yMetric.label}${yMetric.unit ? ` (${yMetric.unit})` : ""}`,
                      angle: -90,
                      position: "insideLeft",
                      offset: 5,
                      fontSize: 10,
                      fill: "var(--muted-foreground)",
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      const d = payload[0].payload as { name: string; value: number };
                      return (
                        <div className="rounded border border-border bg-background px-3 py-2 text-xs shadow-sm">
                          <p className="font-medium text-foreground">{d.name}</p>
                          <p className="text-muted-foreground">
                            Avg {yMetric.label}: {d.value} {yMetric.unit}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" isAnimationActive={false}>
                    {barData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          {legendItems.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[0.625rem] text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
