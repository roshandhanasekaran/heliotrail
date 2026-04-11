// Metric definitions for the KPI Explorer chart builder.
// Each metric defines how to extract a value from a passport data point.

export interface ExplorerMetric {
  id: string;
  label: string;
  unit: string;
  category: "technical" | "environmental" | "compliance";
  type: "continuous" | "categorical";
}

// Per-passport data point for the explorer (built on the server, passed to client)
export interface PassportDataPoint {
  id: string;
  modelId: string;
  status: string;
  technology: string;
  carbonFootprint: number | null;
  ratedPower: number | null;
  efficiency: number | null;
  moduleMass: number | null;
  recyclabilityRate: number | null;
  certCount: number;
  validCertPercent: number;
}

export const EXPLORER_METRICS: ExplorerMetric[] = [
  // Continuous
  { id: "carbonFootprint", label: "Carbon Footprint", unit: "kg CO₂e", category: "environmental", type: "continuous" },
  { id: "ratedPower", label: "Rated Power", unit: "W", category: "technical", type: "continuous" },
  { id: "efficiency", label: "Module Efficiency", unit: "%", category: "technical", type: "continuous" },
  { id: "moduleMass", label: "Module Mass", unit: "kg", category: "technical", type: "continuous" },
  { id: "recyclabilityRate", label: "Recyclability Rate", unit: "%", category: "environmental", type: "continuous" },
  { id: "certCount", label: "Certificate Count", unit: "", category: "compliance", type: "continuous" },
  { id: "validCertPercent", label: "Valid Cert %", unit: "%", category: "compliance", type: "continuous" },
  // Categorical
  { id: "technology", label: "Technology", unit: "", category: "technical", type: "categorical" },
  { id: "status", label: "Status", unit: "", category: "compliance", type: "categorical" },
];

export const CONTINUOUS_METRICS = EXPLORER_METRICS.filter((m) => m.type === "continuous");
export const COLOR_BY_OPTIONS = [
  { id: "technology", label: "Technology" },
  { id: "status", label: "Status" },
  { id: "none", label: "None" },
] as const;

export type ColorByOption = (typeof COLOR_BY_OPTIONS)[number]["id"];
export type ChartType = "scatter" | "bar" | "line";

export const TECHNOLOGY_COLORS: Record<string, string> = {
  crystalline_silicon_topcon: "#22C55E",
  crystalline_silicon_perc: "#3B82F6",
  crystalline_silicon_hjt: "#F59E0B",
  thin_film_cdte: "#EF4444",
  thin_film_cigs: "#8B5CF6",
  other: "#737373",
};

export const STATUS_COLORS: Record<string, string> = {
  published: "#22C55E",
  under_review: "#F59E0B",
  draft: "#D9D9D9",
  approved: "#3B82F6",
  archived: "#737373",
};

export function getPointColor(
  point: PassportDataPoint,
  colorBy: ColorByOption,
): string {
  if (colorBy === "technology") {
    return TECHNOLOGY_COLORS[point.technology] ?? TECHNOLOGY_COLORS.other;
  }
  if (colorBy === "status") {
    return STATUS_COLORS[point.status] ?? "#737373";
  }
  return "#22C55E";
}
